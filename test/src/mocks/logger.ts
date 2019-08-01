import { stubObject } from 'ts-sinon'
import { ILogger, Logger } from '../../../src'

export function getLoggerStub() {
  return stubObject<ILogger>(new Logger('test', 'yellow'))
}
