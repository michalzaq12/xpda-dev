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

  spinnerFail(text: string) {
    spinner.fail(formatSpinnerTitle() + chalk.underline.redBright(text))
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

  log(loggerName, loggerColor, text, textColor?) {
    if (text.trim() === '' || text.trim() === ' ') return
    if (spinner.isSpinning) {
      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)
    }
    if (this.lastActiveLoggerName !== loggerName)
      console.log(chalk.keyword('white').bgKeyword(loggerColor)(`\n  ${loggerName}  `))
    text = text
      .split(/\r?\n/)
      .map(el => chalk.keyword(loggerColor)('│  ') + el)
      .join('\n')
    if (textColor !== undefined) process.stdout.write(chalk.keyword(textColor)(text))
    else process.stdout.write(text)
    process.stdout.write('\n')
    this.lastActiveLoggerName = loggerName
  },
}
