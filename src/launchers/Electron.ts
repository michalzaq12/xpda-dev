import * as electronPath from 'electron'
import { ChildProcess, spawn } from 'child_process'
import { EventEmitter } from 'events'
import { killWithAllSubProcess } from '../utils/kill-process'
import { ILogger } from '../logger/ILogger'
import { ILauncher } from './ILauncher'

export interface IElectronConfig {
  logger: ILogger
  entryFile: string
  inspectionPort?: number
  relaunchCode?: number
}

export class Electron extends EventEmitter implements ILauncher {
  readonly logger: ILogger
  readonly relaunchCode: number
  readonly inspectionPort: number
  readonly entryFile: string
  private process: ChildProcess = null

  constructor(config: IElectronConfig) {
    super()
    this.entryFile = config.entryFile
    this.relaunchCode = config.relaunchCode || 250
    this.inspectionPort = config.inspectionPort || 5858
    this.logger = config.logger
    this.logger.ignore(text => text.includes('source: chrome-devtools://devtools/bundled/shell.js (108)'))
  }

  public async launch() {
    let args = [`--inspect=${this.inspectionPort}`, this.entryFile, '--auto-detect=false', '--no-proxy-server']

    // if (process.env.npm_execpath.endsWith('yarn.js')) {
    //   args = args.concat(process.argv.slice(3))
    // } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    //   args = args.concat(process.argv.slice(2))
    // }

    this.process = spawn((electronPath as unknown) as string, args)
    this.pipe(this.logger)

    this.process.on('exit', code => {
      if (code === this.relaunchCode) this.relaunch()
      else {
        this.exit()
        this.emit('exit', code)
      }
    })
  }

  public get isRunning() {
    return this.process !== null
  }

  public get pid() {
    if (!this.isRunning) return undefined
    else return this.process.pid
  }

  public async relaunch() {
    if (!this.isRunning) return
    this.emit('relaunch')
    await this.exit()
    this.launch()
  }

  public async exit() {
    if (!this.isRunning) return
    this.process.removeAllListeners('exit')

    // @ts-ignore
    this.process.stdout.end()
    // @ts-ignore
    this.process.stderr.end()

    await killWithAllSubProcess(this.pid)
    this.process = null
  }

  private pipe(logger: ILogger) {
    if (!this.isRunning) return
    this.process.stdout.pipe(logger.stdout)
    this.process.stderr.pipe(logger.stdout)
  }
}
