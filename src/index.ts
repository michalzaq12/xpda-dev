import {Logger} from './utils/logger'
import * as path from 'path'
// @ts-ignore
import del from 'del'

import { ElectronApp } from './Electron'
import {IBuilder} from "./IBuilder";


interface IConfig {
  isProduction: boolean,
  isDevelopment: boolean,
  entryFile: string,
}

export class Pipeline {
  private static instance: Pipeline;

  readonly electron : ElectronApp;
  readonly config : IConfig;
  private other : Array<IBuilder> = [];

  constructor(config : IConfig) {
    this.config = config;
    this.electron = new ElectronApp(config.entryFile)
    this.electron.on('exit', code => {
      Logger.info('Killing all processes... (reason: electron app close event) ')
      cleanupProcessAndExit(code)
    })
  }

  static createInstance(config : IConfig){
    Pipeline.instance = new Pipeline(config);
    return Pipeline.instance;
  }

  static getInstance() {
    return Pipeline.instance;
  }

  addBuilder(builder : IBuilder){
    this.other.push(builder);
  }

  public build(){
    const text = this.config.isDevelopment ? 'starting development env...' : 'building for production'
    Logger.spinnerStart(text)

    if (this.config.isProduction) cleanBuildDirectory()

    const promises = [];

    this.other.forEach(builder => {
      promises.push(builder.build())
    })

    Promise.all(promises)
      .then(() => {
        if (this.config.isDevelopment) this.electron.launch()
        Logger.spinnerSucceed('Done')
        if (!this.config.isDevelopment) cleanupProcessAndExit(0)
      })
      .catch(err => {
        Logger.spinnerFail('Something went wrong', err)
        cleanupProcessAndExit(1)
      })
  }

}





function cleanBuildDirectory () {
  try {
    del.sync(['dist/main/*', '!.gitkeep'])
    del.sync(['dist/renderer/*', '!.gitkeep'])
    del.sync(['build/**/*.pak'])
  } catch (err) {
    Logger.spinnerFail('Error occurred when cleaning build directory', err)
    cleanupProcessAndExit(1)
  }
}


async function cleanupProcessAndExit (exitCode, exit = true) {
  await Pipeline.getInstance().electron.exit()
  if (exit) process.exit(exitCode)
}

// https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

// exit param = false -> prevention of an infinite loop
process.on('exit', code => cleanupProcessAndExit(code, false))

// catches ctrl+c event
process.on('SIGINT', code => cleanupProcessAndExit(code))

// catches "kill pid"
process.on('SIGUSR1', code => cleanupProcessAndExit(code))
process.on('SIGUSR2', code => cleanupProcessAndExit(code))

// catches uncaught exceptions
process.on('uncaughtException', e => {
  console.log('Uncaught Exception')
  console.log(e.stack)
  cleanupProcessAndExit(99)
})
