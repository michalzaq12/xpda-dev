type WritableStream = NodeJS.WritableStream
import { Writable } from 'stream'
import { Console } from 'console'
import { ILogger, IPipelineLogger } from '../index'

export class Logger implements ILogger {
  public stdout: WritableStream
  public stderr: WritableStream
  private ignoreFunction: Function
  private pipelineLogger: IPipelineLogger
  private errorLogger: Console

  private stdoutBuffer: Array<Buffer> = []
  private stderrBuffer: Array<Buffer> = []

  constructor(readonly name: string, readonly color: string) {
    this.initStream()
    this.errorLogger = new Console(this.stderr)
  }

  private initStream() {
    const self = this
    this.stdout = new Writable({
      write(chunk, encoding, callback) {
        self.stdoutBuffer.push(chunk)
        if (chunk.includes('\n')) {
          self.info(Buffer.concat(self.stdoutBuffer).toString(encoding === 'buffer' ? undefined : encoding))
          self.stdoutBuffer = []
        }
        callback()
      },
    })
    this.stderr = new Writable({
      write(chunk, encoding, callback) {
        self.stderrBuffer.push(chunk)
        if (chunk.includes('\n')) {
          self.info(Buffer.concat(self.stderrBuffer).toString(encoding === 'buffer' ? undefined : encoding), 'red')
          self.stderrBuffer = []
        }
        callback()
      },
    })

    this.stdout.on('finish', () => {
      // Reopen stream
      // This statement is needed because unpipe method close all streams
      // what causes an error 'write after end' while electron relaunching
      this.initStream()
    })
  }

  info(text: string, color?: string) {
    if (this.ignoreFunction !== undefined && this.ignoreFunction(text)) return
    this.pipelineLogger.log(this.name, this.color, text, color)
  }

  error(text: Error | string) {
    this.errorLogger.error(text)
  }

  ignore(ignoreFunc) {
    this.ignoreFunction = ignoreFunc
  }

  setPipelineLogger(pipelineLogger: IPipelineLogger) {
    this.pipelineLogger = pipelineLogger
  }
}
