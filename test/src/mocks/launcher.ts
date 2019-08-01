import { stubObject } from 'ts-sinon'
import { ElectronLauncher, ILauncher } from '../../../src'

export function getLauncherStub() {
  return stubObject<ILauncher>(
    new ElectronLauncher({
      entryFile: 'dummy_string',
    })
  )
}
