import { onProcessExit } from './utils/onProcessExit'
import { IBuilder, ILauncher, IStep, IPipelineLogger, PipelineLogger, PipelineError } from '.'

export interface IConfig {
  isDevelopment: boolean
  title?: string
  launcher?: ILauncher
  builder?: IBuilder
  pipelineLogger?: IPipelineLogger
  steps?: Array<IStep>
  attachToProcess?: boolean
  buildOnlySteps?: boolean
}

export class Pipeline {
  private readonly title: string
  private readonly isDev: boolean
  private readonly builder: IBuilder
  private readonly launcher: ILauncher
  private steps: Array<IStep>
  private readonly logger: IPipelineLogger

  constructor(readonly config: IConfig) {
    this.isDev = config.isDevelopment
    this.title = config.title || 'xpda-dev'
    this.builder = config.builder || null
    this.launcher = config.launcher || null
    this.steps = config.steps || []
    this.logger =
      config.pipelineLogger || new PipelineLogger({ title: this.title, disableSpinner: process.env.CI === 'true' })
    this.validate()
    this.init()
  }

  private validate() {
    if (this.config.buildOnlySteps) return
    if (this.isDev && this.launcher === null)
      throw new PipelineError('You must pass launcher instance in development mode')
    if (!this.isDev && this.builder === null)
      throw new PipelineError('You must pass builder instance in production mode')
  }

  private init() {
    this.steps.forEach(step => step.logger.setPipelineLogger(this.logger))
    if (this.builder !== null) this.builder.logger.setPipelineLogger(this.logger)
    if (this.config.attachToProcess) onProcessExit(this.stop.bind(this))
    if (this.launcher === null) return
    this.launcher.logger.setPipelineLogger(this.logger)
    this.launcher.on('relaunch', () => this.logger.spinnerInfo('Relaunching electron... '))
    this.launcher.on('exit', async () => {
      this.logger.spinnerInfo('Killing all processes... (reason: launcher close event) ')
      this.stop()
    })
  }

  async stop() {
    for (const step of this.steps) await step.terminate()
    this.steps = []
    await this.launcher.exit()
  }

  async run() {
    this.logger.spinnerStart('Starting ...')

    const promises = []

    this.steps.forEach(builder => {
      promises.push(builder.build(this.isDev))
    })

    return Promise.all(promises)
      .then(async () => {
        this.logger.spinnerSucceed('All steps completed.')
        if (this.config.buildOnlySteps) return
        try {
          if (this.isDev) await this.buildDevelopment()
          else await this.buildProduction()
        } catch (e) {
          this.logger.spinnerFail(e)
          process.exit(1)
        }
      })
      .catch(async e => {
        this.logger.spinnerFail(e)
        process.exit(1)
      })
  }

  private async buildDevelopment() {
    await this.launcher.launch()
    this.logger.spinnerInfo('Waiting for file changes ...')
  }

  private async buildProduction() {
    this.logger.spinnerStart('Building app for distribution')
    await this.builder.build()
    this.logger.spinnerSucceed('Build completed')
  }
}
