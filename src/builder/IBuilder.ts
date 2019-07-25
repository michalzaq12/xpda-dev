import { ILogAble } from '../logger/ILogAble'

export interface IBuilder extends ILogAble {
  build(): Promise<any>
}
