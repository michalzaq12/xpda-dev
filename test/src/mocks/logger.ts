import { stubInterface } from '@salesforce/ts-sinon'
import { ILogger } from '../../../src/logger/ILogger'
import { SinonSandbox, createSandbox } from 'sinon'

export function getLoggerStub(sandbox?: SinonSandbox) {
  return stubInterface<ILogger>(sandbox || createSandbox())
}
