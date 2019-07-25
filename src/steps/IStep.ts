import { ILogAble } from '../logger/ILogAble'

export interface IStep extends ILogAble {
  build(isDev: boolean): Promise<void>
  terminate(): Promise<void>
}
