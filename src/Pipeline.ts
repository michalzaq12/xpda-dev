import { Logger } from './utils/logger'
import * as del from 'del'
import { ElectronApp, IElectronConfig } from './Electron'
import { IPipelineStep } from './IPipelineStep'
import { cleanupAndExit } from './cleanup'

export interface IConfig {
  isProduction: boolean
  isDevelopment: boolean
  electron: IElectronConfig
}

export class Pipeline {
  private static instances: Array<Pipeline> = []

  private electron: ElectronApp
  readonly config: IConfig
  private steps: Array<IPipelineStep> = []

  constructor(config: IConfig) {
    Pipeline.instances.push(this)
    this.config = config
    this.setupElectron()
  }

  private setupElectron() {
    this.electron = new ElectronApp(this.config.electron, new Logger('Electron', 'teal'))
    this.electron.on('relaunch', () => Logger.info('Relaunching electron... '))
    this.electron.on('exit', code => {
      Logger.info('Killing all processes... (reason: electron app close event) ')
      cleanupAndExit(code)
    })
  }

  addStep(step: IPipelineStep) {
    this.steps.push(step)
  }

  async stop() {
    this.steps.forEach(async step => {
      await step.terminate()
    })
    this.steps = []
    await this.electron.exit()
  }

  public build() {
    const text = this.config.isDevelopment ? 'starting development env...' : 'building for production'
    Logger.spinnerStart(text)

    if (this.config.isProduction) Pipeline.cleanBuildDirectory()

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build())
    })

    Promise.all(promises)
      .then(() => {
        if (this.config.isDevelopment) this.electron.launch()
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
