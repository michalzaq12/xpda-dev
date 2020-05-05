//import { log } from 'builder-util/out/log'
import { ILogger, Logger, IBuilder, PipelineError } from '@xpda-dev/core'
import * as execa from 'execa'

export interface IElectronBuilderOptions {
  processArgv?: Array<any>
  logger?: ILogger
}

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger

  constructor(readonly options?: IElectronBuilderOptions) {
    this.logger = options.logger || new Logger('Electron-builder', 'teal')
  }

  async build() {
    const argumentsArray = this.options.processArgv || process.argv.slice(2)
    try {
      const subProcess = execa('electron-builder', argumentsArray)
      subProcess.stdout.pipe(this.logger.stdout)
      subProcess.stderr.pipe(this.logger.stdout)
      await subProcess
    } catch (e) {
      this.logger.error(e)
      throw new PipelineError('Error occurred when building application')
    }
  }
}
