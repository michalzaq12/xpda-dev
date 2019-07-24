import { IStep } from '../IStep'
import { ILogger } from '../../utils/ILogger'
import { Configuration, Compiler, Watching } from 'webpack'
import { getBaseConfig, IWebpackConfigBase } from './configBase'
import { getBabelConfig, IWebpackConfigBabel } from './configBabel'

export class Webpack implements IStep {
  private readonly logger: ILogger
  readonly webpackConfig: Configuration
  private readonly compiler: Compiler
  private watching: Watching = null

  constructor(webpackConfig: Configuration, logger: ILogger) {
    this.logger = logger
    this.webpackConfig = webpackConfig
    try {
      const webpack = require('webpack')
      this.compiler = webpack(webpackConfig)
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

  private logStats(stats) {
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
        else this.logStats(stats)
        //else this.emit('after-compile', stats)
        resolve()
      })
    })
  }

  private async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        //this.emit('after-compile', stats)
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
}
