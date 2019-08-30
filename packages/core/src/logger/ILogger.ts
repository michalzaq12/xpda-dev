type WritableStream = NodeJS.WritableStream
import { IPipelineLogger } from './IPipelineLogger'

export interface ILogger {
  readonly stdout: WritableStream
  readonly stderr: WritableStream
  info(text: string)
  error(text: string)
  ignore(test: (text: string) => boolean)
  setPipelineLogger(pipelineLogger: IPipelineLogger)
}
