import { stubInterface } from '@salesforce/ts-sinon'
import { IStep } from '../../../src'
import { SinonSandbox } from 'sinon'
import { getLoggerStub } from './logger'

export function getStepStub(sandbox: SinonSandbox, stepDuration?: number) {
  return stubInterface<IStep>(sandbox, {
    build: () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(), stepDuration || 2000)
      })
    },
    logger: getLoggerStub(sandbox),
  })
}
