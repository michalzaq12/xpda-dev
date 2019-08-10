import { stubInterface } from '@salesforce/ts-sinon'
import { IPipelineLogger } from '../../../src/logger/IPipelineLogger'
import { SinonSandbox, createSandbox } from 'sinon'

export function getPipelineLoggerStub(sandbox?: SinonSandbox) {
  return stubInterface<IPipelineLogger>(sandbox || createSandbox())
}
