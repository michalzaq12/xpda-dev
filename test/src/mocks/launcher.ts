import { stubObject } from 'ts-sinon'
import { ElectronLauncher, ILauncher } from '../../../src'

export const launcherStub = stubObject<ILauncher>(
  new ElectronLauncher({
    entryFile: 'dummy_string',
  })
)
