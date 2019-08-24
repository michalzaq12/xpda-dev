import { ChildProcess, spawn } from 'child_process'
import { EventEmitter } from 'events'
import { ILogger, Logger, ILauncher, utils } from '@xpda-dev/core'
const { killWithAllSubProcess } = utils

export interface IElectronOptions {
  electronPath: string
  entryFile: string
  logger?: ILogger
  inspectionPort?: number
  relaunchCode?: number
}

export class ElectronLauncher extends EventEmitter implements ILauncher {
  readonly logger: ILogger
  readonly relaunchCode: number
  readonly inspectionPort: number
  readonly electronPath: string
  readonly entryFile: string
  private process: ChildProcess = null

  constructor(options: IElectronOptions) {
    super()
    this.electronPath = options.electronPath
    this.entryFile = options.entryFile
    this.relaunchCode = options.relaunchCode || 250
    this.inspectionPort = options.inspectionPort || 5858
    this.logger = options.logger || new Logger('Electron', 'teal')
    this.logger.ignore(text => text.includes('source: chrome-devtools://devtools/bundled/shell.js (108)'))
  }

  public async launch() {
    let args = [`--inspect=${this.inspectionPort}`, this.entryFile, '--auto-detect=false', '--no-proxy-server']

    this.process = spawn(this.electronPath, args)
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

    await killWithAllSubProcess(this.pid, this.logger.error.bind(this.logger))
    this.process = null
  }

  private pipe(logger: ILogger) {
    if (!this.isRunning) return
    this.process.stdout.pipe(logger.stdout)
    this.process.stderr.pipe(logger.stdout)
  }
}
