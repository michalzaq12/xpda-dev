import { ILogAble } from '.'

export interface IStep extends ILogAble {
  build(isDev: boolean): Promise<any>
  terminate(): Promise<any>
}
