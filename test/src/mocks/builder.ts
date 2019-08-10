import { stubInterface } from '@salesforce/ts-sinon'
import { IBuilder } from '@this/core'
import { SinonSandbox } from 'sinon'
import { getLoggerStub } from './logger'

export function getBuilderStub(sandbox: SinonSandbox) {
  return stubInterface<IBuilder>(sandbox, {
    build: () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(), 2000)
      })
    },
    logger: getLoggerStub(sandbox),
  })
}
