import { stubInterface } from '@salesforce/ts-sinon'
import { ILauncher } from '../../src'
import { SinonSandbox } from 'sinon'
import { getLoggerStub } from './logger'

export function getLauncherStub(sandbox: SinonSandbox) {
  return stubInterface<ILauncher>(sandbox, {
    logger: getLoggerStub(sandbox),
  })
}
