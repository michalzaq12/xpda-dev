import * as execa from 'execa'
import { build, CliOptions } from 'electron-builder'
import { IBuilder } from './IBuilder'
import { ILogger } from '../logger/ILogger'

export class ElectronBuilder implements IBuilder {
  readonly logger: ILogger
  readonly configPath?: string

  constructor(config: { logger: ILogger; configPath?: string }) {
    this.logger = config.logger
    this.configPath = config.configPath
  }

  async build() {
    const commandArguments = this.configPath ? [`--config ${this.configPath}`] : []
    const command = execa('electron-builder', commandArguments)
    command.stdout.pipe(this.logger.stdout)
    await command
  }
}

// var options = {
//   platform: 'osx',
//   out: 'release/osx',
//   config: config,
//   appPath: 'release/osx/Application.app,
//   basePath: '.'
// };
//
// // create the installer
// var electronBuilder = builder.init();
// electronBuilder.build(options, function(){
//   // other stuff here
// });
