import { stubObject } from 'ts-sinon'
import { ElectronLauncher, ILauncher } from '../../../src'

export const launcher = stubObject<ILauncher>(
  new ElectronLauncher({
    entryFile: 'dummy_string',
  })
)
