import { stubInterface } from 'ts-sinon'
import { IPipelineLogger } from '../../../src'

export function getPipelineLoggerStub() {
  return stubInterface<IPipelineLogger>({
    spinnerFail(e) {
      console.log(e)
    },
  })
}
