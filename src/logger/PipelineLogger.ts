type WritableStream = NodeJS.WritableStream
import * as readline from 'readline'
import ora, { Ora } from 'ora'
import chalk from 'chalk'
import { IPipelineLogger } from '..'

const SUCCEED = chalk.green('[SUCCEED] ')
const START = chalk.blue('[START] ')
const INFO = chalk.blue('[INFO] ')
const FAIL = chalk.redBright('[FAIL] ')

export interface IPipelineLoggerOptions {
  title: string
  stream?: WritableStream
  disableSpinner?: boolean
}

export class PipelineLogger implements IPipelineLogger {
  private readonly stream: WritableStream
  private spinner: Ora
  private staticSpinner: Ora
  private lastActiveTitle: string

  constructor(readonly options: IPipelineLoggerOptions) {
    options.disableSpinner = options.disableSpinner || false
    this.stream = options.stream || process.stdout
    if (!this.options.disableSpinner) this.initSpinners()
  }

  private initSpinners() {
    this.spinner = ora({
      text: this.options.title,
      stream: this.stream,
      color: 'white',
    })

    this.staticSpinner = ora({
      isEnabled: false,
      stream: this.stream,
      color: 'white',
    })
  }

  private clearSpinner() {
    if (!this.spinner || !this.spinner.isSpinning) return
    readline.clearLine(this.stream, 0)
    readline.cursorTo(this.stream, 0)
  }

  private formatSpinnerTitle() {
    this.stream.write('\n')
    return chalk.underline.bold(this.options.title) + ': '
  }

  private printTitle(title: string, color: string) {
    if (this.lastActiveTitle === title) return
    const time = new Date().toLocaleTimeString()
    let text = chalk.keyword('white').bgKeyword(color)(`\n  ${title}  `)
    text += chalk.gray(' [' + time + ']')
    this.stream.write(text)
    this.stream.write('\n')
  }

  spinnerFail(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message || 'Error'
    const formattedText = this.formatSpinnerTitle() + chalk.redBright(message)
    if (this.options.disableSpinner) this.writeToStream(FAIL + formattedText)
    else this.spinner.fail(formattedText)
    if (typeof error !== 'string') console.log(error)
  }

  spinnerInfo(text: string) {
    this.lastActiveTitle = ''
    const formattedText = this.formatSpinnerTitle() + text
    if (this.options.disableSpinner) return this.writeToStream(INFO + formattedText)
    this.staticSpinner.info(formattedText)
  }

  spinnerStart(text: string) {
    const formattedText = this.formatSpinnerTitle() + text
    if (this.options.disableSpinner) return this.writeToStream(START + formattedText)
    this.spinner.start(formattedText)
  }

  spinnerSucceed(text: string) {
    const formattedText = this.formatSpinnerTitle() + text
    if (this.options.disableSpinner) return this.writeToStream(SUCCEED + formattedText)
    this.spinner.succeed(formattedText)
  }

  private writeToStream(text: string) {
    this.stream.write(text)
    this.stream.write('\n')
  }

  log(title: string, color: string, text: string) {
    if (text.trim() === '' || text.trim() === ' ') return
    this.clearSpinner()
    this.printTitle(title, color)
    text = text
      .split(/\r?\n/)
      .map(el => chalk.keyword(color)('│  ') + el)
      .join('\n')
    this.writeToStream(text)
    this.lastActiveTitle = title
  }
}
