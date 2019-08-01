import { stubObject } from 'ts-sinon'
import { IBuilder, ElectronBuilder } from '../../../src'

export function getBuilderStub() {
  return stubObject<IBuilder>(new ElectronBuilder())
}
