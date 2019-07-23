import { Stream } from 'stream'

import * as electronPath from 'electron'
import { ChildProcess, spawn } from 'child_process'
import { EventEmitter } from 'events'
import { killWithAllSubProcess } from './utils/kill-process'
import { ILogger } from './utils/ILogger'

export interface IElectronConfig {
  entryFile: string
  inspectionPort?: number
  relaunchCode?: number
}

export class ElectronApp extends EventEmitter {
  readonly relaunchCode: number
  readonly inspectionPort: number
  readonly entryFile: string
  private outputStd: Stream = null
  private process: ChildProcess = null
  public logger: ILogger

  constructor(config: IElectronConfig, logger: ILogger) {
    super()
    this.entryFile = config.entryFile
    this.relaunchCode = config.relaunchCode || 250
    this.inspectionPort = config.inspectionPort || 5858
    this.logger = logger
    this.logger.ignore(text => text.includes('source: chrome-devtools://devtools/bundled/shell.js (108)'))
    this.redirectStdout(this.logger)
  }

  public launch() {
    let args = [`--inspect=${this.inspectionPort}`, this.entryFile, '--auto-detect=false', '--no-proxy-server']

    // if (process.env.npm_execpath.endsWith('yarn.js')) {
    //   args = args.concat(process.argv.slice(3))
    // } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    //   args = args.concat(process.argv.slice(2))
    // }

    // @ts-ignore
    this.process = spawn(electronPath, args)

    if (this.outputStd) this.pipe(this.outputStd)

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

    await killWithAllSubProcess(this.pid)
    this.process = null
  }

  public redirectStdout(stream) {
    this.outputStd = stream
    this.pipe(stream)
  }

  private pipe(stream) {
    if (!this.isRunning) return
    this.process.stdout.pipe(stream.stdout)
    this.process.stderr.pipe(stream.stderr)
  }
}
