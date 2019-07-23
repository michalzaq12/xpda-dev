import { IStep } from './IStep'
import { ILogger } from '../utils/ILogger'

export class Timer implements IStep {
  private timeout
  private readonly logger: ILogger

  constructor(logger: ILogger) {
    this.logger = logger
  }

  build(): Promise<void> {
    this.logger.info('build')
    return new Promise(resolve => {
      this.timeout = setTimeout(() => resolve(), 2000)
    })
  }

  terminate(): Promise<void> {
    this.logger.info('terminate')
    return new Promise(resolve => {
      clearTimeout(this.timeout)
      resolve()
    })
  }
}
