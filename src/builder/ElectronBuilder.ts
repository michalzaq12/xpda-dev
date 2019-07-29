import { log } from 'builder-util/out/log'
import { build, CliOptions } from 'electron-builder'
import { IBuilder } from './IBuilder'
import { ILogger } from '../logger/ILogger'
import { PipelineError } from '../error/PipelineError'

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger
  readonly configPath?: string

  constructor(readonly config: { logger: ILogger; options?: CliOptions }) {
    this.logger = config.logger
  }

  async build() {
    // @ts-ignore
    log.stream = this.logger.stdout
    try {
      await build(this.config.options)
    } catch (e) {
      this.logger.error(e)
      throw new PipelineError('Error occurred when building application')
    }
  }
}
