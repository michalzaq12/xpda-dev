import { Writable } from 'stream'
import { IPipelineLogger } from './IPipelineLogger'

export interface ILogger {
  readonly stdout: Writable
  readonly stderr: Writable
  info(text: string)
  error(text: string)
  ignore(test: (text: string) => boolean)
  setPipelineLogger(pipelineLogger: IPipelineLogger)
}
