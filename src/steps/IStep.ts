import { ILogAble } from '../logger/ILogAble'

export interface IStep extends ILogAble {
  build(isDev: boolean): Promise<any>
  terminate(): Promise<any>
}
