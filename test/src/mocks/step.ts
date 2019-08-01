import { stubObject } from 'ts-sinon'
import { IStep, Timer } from '../../../src'
import { getLoggerStub } from './logger'

export function getStepStub(stepDuration?: number) {
  return stubObject<IStep>(new Timer(getLoggerStub(), stepDuration))
}
