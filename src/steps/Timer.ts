import { IStep } from './IStep'
import { ILogger } from '../logger/ILogger'
import { setTimeout, clearTimeout } from 'timers'
import Timeout = NodeJS.Timeout

export class Timer implements IStep {
  private handler: Timeout
  private readonly timeout: number
  readonly logger: ILogger

  constructor(logger: ILogger, timeout?: number) {
    this.logger = logger
    this.timeout = timeout || 2000
  }

  build(): Promise<void> {
    return new Promise(resolve => {
      this.handler = setTimeout(() => resolve(), this.timeout)
    })
  }

  terminate(): Promise<void> {
    return new Promise(resolve => {
      clearTimeout(this.handler)
      resolve()
    })
  }
}
