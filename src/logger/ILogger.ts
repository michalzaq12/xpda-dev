import { Writable } from 'stream'

export interface ILogger {
  readonly stdout: Writable
  readonly stderr: Writable
  info(text: string)
  error(text: string)
  ignore(test: (text: string) => boolean)
}
