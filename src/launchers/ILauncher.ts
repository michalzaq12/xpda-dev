import { EventEmitter } from 'events'

export interface ILauncher extends EventEmitter {
  readonly isRunning: boolean
  readonly pid: number
  launch(): Promise<any>
  relaunch(): Promise<any>
  exit(): Promise<any>
}
