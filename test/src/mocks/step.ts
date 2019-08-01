import { stubObject } from 'ts-sinon'
import { IStep, Timer } from '../../../src'
import { getLoggerStub } from './logger'

export function getStepStub() {
  return stubObject<IStep>(new Timer(getLoggerStub()))
}
