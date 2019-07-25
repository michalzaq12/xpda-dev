import { Logger } from './logger/Logger'
import * as del from 'del'
import { IStep } from './steps/IStep'
import { cleanupAndExit } from './cleanup'
import { ILauncher } from './launchers/ILauncher'
import { IPipelineLogger } from './logger/IPipelineLogger'
import { pipelineLogger as basePipelineLogger } from './logger/pipelineLogger'
import { IBuilder } from './builder/IBuilder'

export interface IConfig {
  isDevelopment: boolean
  launcher: ILauncher
  builder?: IBuilder
  pipelineLogger?: IPipelineLogger
  steps?: Array<IStep>
}

export class Pipeline {
  private static instances: Array<Pipeline> = []

  private readonly isDev: boolean
  private readonly builder: IBuilder
  private launcher: ILauncher
  private steps: Array<IStep>
  private readonly logger: IPipelineLogger

  constructor(config: IConfig) {
    Pipeline.instances.push(this)
    this.isDev = config.isDevelopment
    this.builder = config.builder || null
    this.launcher = config.launcher
    this.steps = config.steps || []
    this.logger = config.pipelineLogger || basePipelineLogger
    this.launcher.on('relaunch', () => this.logger.spinnerInfo('Relaunching electron... '))
    this.launcher.on('exit', async code => {
      this.logger.spinnerInfo('Killing all processes... (reason: electron app close event) ')
      await cleanupAndExit(code)
    })
  }

  addStep(step: IStep) {
    this.steps.push(step)
  }

  async stop() {
    for (const step of this.steps) await step.terminate()
    this.steps = []
    await this.launcher.exit()
  }

  private attachLoggers() {
    this.steps.forEach(step => step.logger.setPipelineLogger(this.logger))
    this.launcher.logger.setPipelineLogger(this.logger)
  }

  public build() {
    this.attachLoggers()
    this.logger.spinnerStart('starting ...')

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build(this.isDev))
    })

    Promise.all(promises)
      .then(async () => {
        try {
          if (this.isDev) await this.buildDevelopment()
          else await this.buildProduction()
        } catch (e) {
          this.logger.spinnerFail(e.message)
        }
      })
      .catch(async err => {
        //TODO error toString()
        this.logger.spinnerFail(err || 'Something went wrong')
        await cleanupAndExit(1)
      })
  }

  private async buildDevelopment() {
    await this.launcher.launch()
    this.logger.spinnerSucceed('All steps completed. Waiting for file changes ...')
  }

  private async buildProduction() {
    this.logger.spinnerSucceed('All steps completed.')
    if (this.builder === null) return await cleanupAndExit(0)
    this.logger.spinnerStart('Building app for distribution')
    await this.builder.build()
    this.logger.spinnerSucceed('Build completed')
    await cleanupAndExit(0)
  }

  static async stopAllPipelines() {
    const promises = []
    this.instances.forEach(pipeline => {
      promises.push(pipeline.stop())
    })
    await Promise.all(promises)
    this.instances = []
  }
}
