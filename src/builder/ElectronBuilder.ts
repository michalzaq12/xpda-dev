import { log } from 'builder-util/out/log'
import { build, CliOptions } from 'electron-builder'
import { IBuilder } from './IBuilder'
import { ILogger } from '../logger/ILogger'

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger
  readonly configPath?: string

  constructor(config: { logger: ILogger; configPath?: string }) {
    this.logger = config.logger
    this.configPath = config.configPath
  }

  async build() {
    // @ts-ignore
    log.stream = this.logger.stdout
    try {
      await build({
        config: this.configPath,
      })
    } catch (e) {
      this.logger.error(e)
      throw new Error('Error occurred when building application')
    }
  }
}
