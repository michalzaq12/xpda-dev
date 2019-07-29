import { IPipelineLogger } from './IPipelineLogger'
import * as readline from 'readline'
import ora from 'ora'
import chalk from 'chalk'

const spinner = ora({
  text: 'Staring ...',
  stream: process.stdout,
  color: 'white',
})

const staticLogger = ora({
  isEnabled: false,
  stream: process.stdout,
  color: 'white',
})

let spinnerTitle = 'Title'

function formatSpinnerTitle() {
  process.stdout.write('\n')
  return chalk.underline.bold(spinnerTitle) + ': '
}

export const pipelineLogger: IPipelineLogger = {
  lastActiveTitle: '',

  setSpinnerTitle(text) {
    spinnerTitle = text
  },

  spinnerFail(error: Error | string) {
    //TODO refactor
    if (typeof error === 'string') {
      spinner.fail(formatSpinnerTitle() + chalk.redBright(error))
    } else if (error instanceof Error) {
      spinner.fail(formatSpinnerTitle() + chalk.redBright(error.message))
      console.log(error)
    } else {
      spinner.fail()
      console.log(error)
    }
  },

  spinnerInfo(text: string) {
    this.lastActiveTitle = ''
    staticLogger.info(formatSpinnerTitle() + text)
  },

  spinnerStart(text?: string) {
    if (text !== undefined) spinner.text = formatSpinnerTitle() + text
    spinner.start()
  },

  spinnerSucceed(text: string) {
    spinner.succeed(formatSpinnerTitle() + text)
  },

  _clearSpinner() {
    if (!spinner.isSpinning) return
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
  },

  _printTitle(title: string, color: string) {
    if (this.lastActiveTitle === title) return
    const time = new Date().toLocaleTimeString()
    let text = chalk.keyword('white').bgKeyword(color)(`\n  ${title}  `)
    text += chalk.gray(' [' + time + ']')
    process.stdout.write(text)
    process.stdout.write('\n')
  },

  log(title: string, color: string, text: string) {
    if (text.trim() === '' || text.trim() === ' ') return
    this._clearSpinner()
    this._printTitle(title, color)
    text = text
      .split(/\r?\n/)
      .map(el => chalk.keyword(color)('│  ') + el)
      .join('\n')
    process.stdout.write(text)
    process.stdout.write('\n')
    this.lastActiveTitle = title
  },
}
