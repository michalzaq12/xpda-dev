import { Logger } from './logger/Logger'
import * as del from 'del'
import { IStep } from './steps/IStep'
import { cleanupAndExit } from './cleanup'
import { ILauncher } from './launchers/ILauncher'
import { IPipelineLogger } from './logger/IPipelineLogger'
import { pipelineLogger as basePipelineLogger } from './logger/pipelineLogger'

export interface IConfig {
  isDevelopment: boolean
  launcher: ILauncher
  pipelineLogger?: IPipelineLogger
  steps?: Array<IStep>
}

export class Pipeline {
  private static instances: Array<Pipeline> = []

  private launcher: ILauncher
  readonly config: IConfig
  private steps: Array<IStep>
  private logger: IPipelineLogger

  constructor(config: IConfig) {
    Pipeline.instances.push(this)
    this.config = config
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

  public build() {
    const text = this.config.isDevelopment ? 'starting development env...' : 'building for production'
    this.logger.spinnerStart(text)

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build(this.config.isDevelopment))
    })

    Promise.all(promises)
      .then(async () => {
        if (this.config.isDevelopment) await this.launcher.launch()
        this.logger.spinnerSucceed('Done')
        if (!this.config.isDevelopment) await cleanupAndExit(0)
      })
      .catch(async err => {
        //TODO error toString()
        this.logger.spinnerFail(err || 'Something went wrong')
        await cleanupAndExit(1)
      })
  }

  static async stopAllPipelines() {
    const promises = []
    this.instances.forEach(pipeline => {
      promises.push(pipeline.stop())
    })
    await Promise.all(promises)
    this.instances = []
  }

  //TODO: move to electron launcher
  // static cleanBuildDirectory() {
  //   try {
  //     del.sync(['dist/main/*', '!.gitkeep'])
  //     del.sync(['dist/renderer/*', '!.gitkeep'])
  //     del.sync(['build/**/*.pak'])
  //   } catch (err) {
  //     Logger.spinnerFail('Error occurred when cleaning build directory', err)
  //     cleanupAndExit(1)
  //   }
  // }
}
