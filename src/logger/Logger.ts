import { Writable } from 'stream'
import { ILogger } from './ILogger'
import { IPipelineLogger } from './IPipelineLogger'
import { pipelineLogger as basePipelineLogger } from './pipelineLogger'

export class Logger implements ILogger {
  readonly loggerName: string
  readonly color: string
  public stdout: Writable
  public stderr: Writable
  private ignoreFunction: Function
  private pipelineLogger: IPipelineLogger

  constructor(loggerName, color, pipelineLogger?: IPipelineLogger) {
    this.loggerName = loggerName
    this.color = color
    this.pipelineLogger = pipelineLogger || basePipelineLogger
    this.initStreams()
  }

  private initStreams() {
    const self = this
    this.stdout = new Writable({
      write(chunk, encoding, callback) {
        self.info(chunk)
        callback()
      },
    })
    this.stderr = new Writable({
      write(chunk, encoding, callback) {
        self.error(chunk)
        callback()
      },
    })

    this.stdout.on('finish', () => {
      // Reopen streams
      // This statement is needed because unpipe method close all streams
      // what causes an error 'write after end' while electron relaunching
      this.initStreams()
    })
  }

  info(text) {
    text = text.toString()
    if (this.ignoreFunction !== undefined && this.ignoreFunction(text)) return
    this.pipelineLogger.log(this.loggerName, this.color, text)
  }

  error(text) {
    text = text.toString()
    if (this.ignoreFunction !== undefined && this.ignoreFunction(text)) return
    this.pipelineLogger.log(this.loggerName, this.color, text, 'red')
  }

  ignore(ignoreFunc) {
    this.ignoreFunction = ignoreFunc
  }
}
