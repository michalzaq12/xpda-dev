import { Configuration, LibraryTarget, Plugin, Options, Module, ExternalsElement } from 'webpack'

export interface IWebpackConfigBase {
  entry: string
  externals?: ExternalsElement | ExternalsElement[]
  output: {
    filename?: string
    path: string
    libraryTarget?: LibraryTarget
  }
  module?: Module
  plugins?: Plugin[]
  extensions?: Array<string>
  devtool?: Options.Devtool
  target?:
    | 'web'
    | 'webworker'
    | 'node'
    | 'async-node'
    | 'node-webkit'
    | 'atom'
    | 'electron'
    | 'electron-renderer'
    | 'electron-main'
}

export function getBaseConfig(config: IWebpackConfigBase): Configuration {
  return {
    entry: config.entry,
    externals: config.externals,
    module: config.module || { rules: [] },
    output: {
      filename: config.output.filename || 'index.js',
      libraryTarget: config.output.libraryTarget || 'commonjs2',
      path: config.output.path,
    },
    plugins: config.plugins || [],
    resolve: {
      extensions: ['.js', '.json', '.node'].concat(config.extensions || []),
    },
    devtool: config.devtool,
    target: config.target || 'electron-main',
  }
}
