import { IStep } from './steps/IStep'
import { onProcessExit } from './utils/onProcessExit'
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
  attachToProcess: boolean
}

export class Pipeline {
  private readonly isDev: boolean
  private readonly builder: IBuilder
  private launcher: ILauncher
  private steps: Array<IStep>
  private readonly logger: IPipelineLogger

  constructor(readonly config: IConfig) {
    this.isDev = config.isDevelopment
    this.builder = config.builder || null
    this.launcher = config.launcher
    this.steps = config.steps || []
    this.logger = config.pipelineLogger || basePipelineLogger
    this.init()
  }

  private init() {
    if (this.config.attachToProcess) onProcessExit(this.stop.bind(this))
    this.launcher.on('relaunch', () => this.logger.spinnerInfo('Relaunching electron... '))
    this.launcher.on('exit', async code => {
      this.logger.spinnerInfo('Killing all processes... (reason: electron app close event) ')
      this.stop()
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

  private beforeBuild() {
    this.steps.forEach(step => step.logger.setPipelineLogger(this.logger))
    this.launcher.logger.setPipelineLogger(this.logger)
  }

  public build() {
    this.beforeBuild()
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
          this.logger.spinnerFail(e)
        }
      })
      .catch(async err => {
        //TODO error toString()
        this.logger.spinnerFail(err || 'Something went wrong')
        process.exit(1)
      })
  }

  private async buildDevelopment() {
    await this.launcher.launch()
    this.logger.spinnerSucceed('All steps completed. Waiting for file changes ...')
  }

  private async buildProduction() {
    this.logger.spinnerSucceed('All steps completed.')
    if (this.builder === null) return process.exit(0)
    this.logger.spinnerStart('Building app for distribution')
    await this.builder.build()
    this.logger.spinnerSucceed('Build completed')
    process.exit(0)
  }
}
