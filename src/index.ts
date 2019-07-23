import { Logger } from './utils/logger'
import * as del from 'del'
import { ElectronApp, IElectronConfig } from './Electron'
import { IPipelineStep } from './IPipelineStep'

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
      cleanupProcessAndExit(code)
    })
  }

  addStep(step: IPipelineStep) {
    this.steps.push(step)
  }

  async stop() {
    this.steps.forEach(async step => {
      await step.terminate()
    })
    await this.electron.exit()
  }

  public build() {
    const text = this.config.isDevelopment ? 'starting development env...' : 'building for production'
    Logger.spinnerStart(text)

    if (this.config.isProduction) cleanBuildDirectory()

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build())
    })

    Promise.all(promises)
      .then(() => {
        if (this.config.isDevelopment) this.electron.launch()
        Logger.spinnerSucceed('Done')
        if (!this.config.isDevelopment) cleanupProcessAndExit(0)
      })
      .catch(err => {
        Logger.spinnerFail('Something went wrong', err)
        cleanupProcessAndExit(1)
      })
  }

  static async stopAllPipelines() {
    const promises = []
    this.instances.forEach(pipeline => {
      promises.push(pipeline.stop())
    })
    await Promise.all(promises)
  }
}

function cleanBuildDirectory() {
  try {
    del.sync(['dist/main/*', '!.gitkeep'])
    del.sync(['dist/renderer/*', '!.gitkeep'])
    del.sync(['build/**/*.pak'])
  } catch (err) {
    Logger.spinnerFail('Error occurred when cleaning build directory', err)
    cleanupProcessAndExit(1)
  }
}

async function cleanupProcessAndExit(exitCode, exit = true) {
  await Pipeline.stopAllPipelines()
  if (exit) process.exit(exitCode)
}

// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

// exit param = false -> prevention of an infinite loop
process.on('exit', code => cleanupProcessAndExit(code, false))

// catches ctrl+c event
process.on('SIGINT', code => cleanupProcessAndExit(code))

// catches "kill pid"
process.on('SIGUSR1', code => cleanupProcessAndExit(code))
process.on('SIGUSR2', code => cleanupProcessAndExit(code))

// catches uncaught exceptions
process.on('uncaughtException', e => {
  console.log('Uncaught Exception')
  console.log(e.stack)
  cleanupProcessAndExit(99)
})
