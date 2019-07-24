import { Logger } from './utils/logger'
import * as del from 'del'
import { IStep } from './steps/IStep'
import { cleanupAndExit } from './cleanup'
import { ILauncher } from './launchers/ILauncher'

export interface IConfig {
  isDevelopment: boolean
  launcher: ILauncher
}

export class Pipeline {
  private static instances: Array<Pipeline> = []

  private launcher: ILauncher
  readonly config: IConfig
  private steps: Array<IStep> = []

  constructor(config: IConfig) {
    Pipeline.instances.push(this)
    this.config = config
    this.launcher = config.launcher
    this.launcher.on('relaunch', () => Logger.info('Relaunching electron... '))
    this.launcher.on('exit', code => {
      Logger.info('Killing all processes... (reason: electron app close event) ')
      cleanupAndExit(code)
    })
  }

  addStep(step: IStep) {
    this.steps.push(step)
  }

  async stop() {
    this.steps.forEach(async step => {
      await step.terminate()
    })
    this.steps = []
    await this.launcher.exit()
  }

  public build() {
    const text = this.config.isDevelopment ? 'starting development env...' : 'building for production'
    Logger.spinnerStart(text)

    if (!this.config.isDevelopment) Pipeline.cleanBuildDirectory()

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build(this.config.isDevelopment))
    })

    Promise.all(promises)
      .then(() => {
        if (this.config.isDevelopment) this.launcher.launch()
        Logger.spinnerSucceed('Done')
        if (!this.config.isDevelopment) cleanupAndExit(0)
      })
      .catch(err => {
        Logger.spinnerFail('Something went wrong', err)
        cleanupAndExit(1)
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

  static cleanBuildDirectory() {
    try {
      del.sync(['dist/main/*', '!.gitkeep'])
      del.sync(['dist/renderer/*', '!.gitkeep'])
      del.sync(['build/**/*.pak'])
    } catch (err) {
      Logger.spinnerFail('Error occurred when cleaning build directory', err)
      cleanupAndExit(1)
    }
  }
}
