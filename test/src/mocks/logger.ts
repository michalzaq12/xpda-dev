import { stubObject } from 'ts-sinon'
import { ILogger, Logger } from '../../../src'

export const logger = stubObject<ILogger>(new Logger('test', 'yellow'), {
  setPipelineLogger(logger) {},
})
