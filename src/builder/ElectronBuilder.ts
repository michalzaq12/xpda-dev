import { log } from 'builder-util/out/log'
import { build, CliOptions } from 'electron-builder'
import { ILogger, Logger, IBuilder, PipelineError } from '..'

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger

  constructor(readonly buildOptions?: CliOptions, builderLogger?: ILogger) {
    this.logger = builderLogger || new Logger('Electron-builder', 'teal')
  }

  async build() {
    // @ts-ignore
    log.stream = this.logger.stdout
    try {
      await build(this.buildOptions)
    } catch (e) {
      this.logger.error(e)
      throw new PipelineError('Error occurred when building application')
    }
  }
}
