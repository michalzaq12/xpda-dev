import { ILogAble } from '.'

export interface IBuilder extends ILogAble {
  build(): Promise<any>
}
