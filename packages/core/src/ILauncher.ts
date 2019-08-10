import { EventEmitter } from 'events'
import { ILogAble } from '.'

export interface ILauncher extends EventEmitter, ILogAble {
  readonly isRunning: boolean
  readonly pid: number
  launch(): Promise<any>
  relaunch(): Promise<any>
  exit(): Promise<any>
}
