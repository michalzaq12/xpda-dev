import { stubObject } from 'ts-sinon'
import { ILogger, Logger } from '../../../src'

export const loggerStub = stubObject<ILogger>(new Logger('test', 'yellow'), {
  setPipelineLogger(logger) {},
})
