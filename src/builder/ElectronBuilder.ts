import { log } from 'builder-util/out/log'
import { build, CliOptions } from 'electron-builder'
import { ILogger, Logger, IBuilder, PipelineError } from '..'

export interface IElectronBuilderOptions {
  builderOptions?: CliOptions
  logger?: ILogger
}

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger

  constructor(readonly options?: IElectronBuilderOptions) {
    this.logger = options.logger || new Logger('Electron-builder', 'teal')
  }

  async build() {
    // @ts-ignore
    log.stream = this.logger.stdout
    try {
      await build(this.options.builderOptions)
    } catch (e) {
      this.logger.error(e)
      throw new PipelineError('Error occurred when building application')
    }
  }
}
