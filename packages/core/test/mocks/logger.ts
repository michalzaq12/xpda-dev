import { stubInterface } from '@salesforce/ts-sinon'
import { ILogger } from '../../src'
import { SinonSandbox, createSandbox } from 'sinon'

export function getLoggerStub(sandbox?: SinonSandbox) {
  return stubInterface<ILogger>(sandbox || createSandbox())
}
