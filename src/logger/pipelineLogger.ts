import { IPipelineLogger } from './IPipelineLogger'
import * as readline from 'readline'
import ora from 'ora'
import chalk from 'chalk'

const spinner = ora({
  text: 'Staring ...',
  stream: process.stdout,
  indent: 9,
  color: 'white',
})

const staticLogger = ora({
  isEnabled: false,
  stream: process.stdout,
  indent: 9,
  color: 'white',
})

let spinnerTitle = 'Title'

function formatSpinnerTitle() {
  return chalk.inverse(spinnerTitle) + ': '
}

export const pipelineLogger: IPipelineLogger = {
  lastActiveLoggerName: '',

  setSpinnerTitle(text) {
    spinnerTitle = text
  },

  spinnerFail(error: Error | string) {
    //TODO refactor
    if (typeof error === 'string') {
      spinner.fail(formatSpinnerTitle() + chalk.underline.redBright(error))
    } else if (error instanceof Error) {
      spinner.fail(formatSpinnerTitle() + chalk.underline.redBright(error.message))
      console.log(error)
    } else {
      spinner.fail()
      console.log(error)
    }
  },

  spinnerInfo(text: string) {
    this.lastActiveLoggerName = ''
    staticLogger.info(formatSpinnerTitle() + chalk.underline(text))
  },

  spinnerStart(text?: string) {
    if (text !== undefined) spinner.text = formatSpinnerTitle() + chalk.underline(text)
    spinner.start()
  },

  spinnerSucceed(text: string) {
    spinner.succeed(formatSpinnerTitle() + chalk.underline(text))
  },

  _clearSpinner() {
    if (!spinner.isSpinning) return
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
  },

  _printTitle(name: string, color: string) {
    if (this.lastActiveLoggerName === name) return
    const time = new Date().toLocaleTimeString()
    let title = chalk.keyword('white').bgKeyword(color)(`\n  ${name}  `)
    title += chalk.gray(' [' + time + ']')
    process.stdout.write(title + '\n')
  },

  log(loggerName: string, loggerColor: string, text: string) {
    if (text.trim() === '' || text.trim() === ' ') return
    this._clearSpinner()
    this._printTitle(loggerName, loggerColor)
    text = text
      .split(/\r?\n/)
      .map(el => chalk.keyword(loggerColor)('│  ') + el)
      .join('\n')
    process.stdout.write(text)
    process.stdout.write('\n')
    this.lastActiveLoggerName = loggerName
  },
}
