export interface IWebpackConfigBase {
  mode: 'development' | 'production'
  entry: string
  output: {
    filename?: string
    path: string
    libraryTarget?: string
  }
  plugins?: Array<object>
  extensions?: Array<string>
}

export function getBaseConfig(config: IWebpackConfigBase) {
  const nodeExternals = require('webpack-node-externals')

  return {
    mode: config.mode,
    entry: config.entry,
    externals: [
      nodeExternals({
        modulesFromFile: {
          include: ['dependencies'],
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.node$/,
          use: 'node-loader',
        },
      ],
    },
    output: {
      filename: config.output.filename || 'index.js',
      libraryTarget: config.output.libraryTarget || 'commonjs2',
      path: config.output.path,
    },
    plugins: config.plugins || [],
    resolve: {
      extensions: config.extensions || ['.js', '.json', '.node'],
    },
    target: 'electron-main',
  }
}
