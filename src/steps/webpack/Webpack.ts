import { IStep } from '../IStep'
import { ILogger } from '../../logger/ILogger'
import { ILauncher } from '../../launchers/ILauncher'
import { Configuration, Compiler, Watching, Stats as WebpackStats } from 'webpack'
import { getBaseConfig, IWebpackConfigBase } from './configBase'
import { getBabelConfig, IWebpackConfigBabel } from './configBabel'
import { getTypescriptConfig, IWebpackConfigTypescript } from './configTypescript'

export class Webpack implements IStep {
  readonly logger: ILogger
  readonly webpackConfig: Configuration
  private readonly compiler: Compiler
  private watching: Watching = null
  private readonly launcher: ILauncher

  constructor(config: { webpackConfig: Configuration; logger: ILogger; launcher: ILauncher }) {
    this.logger = config.logger
    this.webpackConfig = config.webpackConfig
    this.launcher = config.launcher
    try {
      const webpack = require('webpack')
      this.compiler = webpack(this.webpackConfig)
    } catch (e) {
      this.logger.error(e.message)
    }
  }

  build(isDev: boolean): Promise<void> {
    this.logger.info('webpack build')
    return isDev ? this.watch() : this.run()
  }

  terminate(): Promise<void> {
    this.logger.info('webpack terminate')
    return new Promise(resolve => {
      if (this.watching === null) resolve()
      else
        this.watching.close(() => {
          this.watching = null
          resolve()
        })
    })
  }

  private logStats(stats: WebpackStats) {
    this.logger.info(
      stats.toString({
        colors: true,
        chunks: false,
      })
    )
  }

  private async watch(): Promise<void> {
    return new Promise(resolve => {
      this.watching = this.compiler.watch({ ignored: /node_modules/, aggregateTimeout: 3000 }, (err, stats) => {
        if (err) this.logger.error(err.message)
        else {
          this.logStats(stats)
          this.launcher.relaunch()
        }
        resolve()
      })
    })
  }

  private async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        this.logStats(stats)
        if (err || stats.hasErrors()) reject('Error occurred during webpack compilation step')
        resolve()
      })
    })
  }

  static getBaseConfig(config: IWebpackConfigBase) {
    return getBaseConfig(config)
  }

  static getBabelConfig(config: IWebpackConfigBabel) {
    return getBabelConfig(config)
  }

  static getTypescriptConfig(config: IWebpackConfigTypescript) {
    return getTypescriptConfig(config)
  }
}
