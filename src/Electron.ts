import {Stream} from "stream";

import * as electronPath from 'electron'
import {ChildProcess, spawn} from "child_process"
import {EventEmitter} from 'events'
import { killWithAllSubProcess } from './utils/kill-process'
import {Logger} from "./utils/Logger";

export * from './utils/Logger'

export class ElectronApp extends EventEmitter {

  readonly RELAUNCH_CODE : number
  readonly INSPECTION_PORT : number
  readonly ENTRY_PATH : string
  private outputStd : Stream
  private process: ChildProcess

  public logger : Logger

  constructor (entryPath, inspectionPort = 5858, relaunchCode = 250) {
    super()
    this.ENTRY_PATH = entryPath
    this.RELAUNCH_CODE = relaunchCode
    this.INSPECTION_PORT = inspectionPort
    this.outputStd = null
    this.process = null
    this.initLogger()
    console.log(this.ENTRY_PATH)
  }

  private initLogger(){
    this.logger = new Logger('Electron', 'teal')
    this.logger.ignore(text => text.indexOf('source: chrome-devtools://devtools/bundled/shell.js (108)') > -1)
    this.redirectStdout(this.logger)
  }

  public launch () {
    let args = [
      `--inspect=${this.INSPECTION_PORT}`,
      this.ENTRY_PATH,
      '--auto-detect=false',
      '--no-proxy-server'
    ]

    // if (process.env.npm_execpath.endsWith('yarn.js')) {
    //   args = args.concat(process.argv.slice(3))
    // } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    //   args = args.concat(process.argv.slice(2))
    // }

    // @ts-ignore
    this.process = spawn(electronPath, args)

    if (this.outputStd) this.pipe(this.outputStd)

    this.process.on('exit', code => {
      if (code === this.RELAUNCH_CODE) {
        this.relaunch()
      } else {
        this.exit()
        this.emit('exit', code)
      }
    })
  }

  public get isRunning () {
    return this.process !== null
  }

  public get pid () {
    if (!this.isRunning) return undefined
    else return this.process.pid
  }

  public async relaunch () {
    if (!this.isRunning) return
    this.emit('relaunch')
    Logger.info('Relaunching electron... ')
    await this.exit()
    this.launch()
  }

  public async exit () {
    if (!this.isRunning) return
    this.process.removeAllListeners('exit')

    await killWithAllSubProcess(this.pid)
    this.process = null
  }

  public redirectStdout (stream) {
    this.outputStd = stream
    this.pipe(stream)
  }

  private pipe (stream) {
    if (!this.isRunning) return
    this.process.stdout.pipe(stream.stdout)
    this.process.stderr.pipe(stream.stderr)
  }
}
