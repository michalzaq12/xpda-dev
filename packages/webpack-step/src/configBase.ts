import { Configuration, LibraryTarget, Plugin, Options, Module } from 'webpack'

export interface IWebpackConfigBase {
  entry: string
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
  const nodeExternals = require('webpack-node-externals')

  return {
    entry: config.entry,
    externals: [
      nodeExternals({
        modulesFromFile: {
          include: ['dependencies'],
        },
      }),
    ],
    module: config.module,
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
