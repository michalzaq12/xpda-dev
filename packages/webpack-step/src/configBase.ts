import type { Configuration } from 'webpack'

export interface IWebpackConfigBase {
  entry: Configuration['entry']
  externals?: Configuration['externals']
  output: Configuration['output']
  module?: Configuration['module']
  plugins?: Configuration['plugins']
  extensions?: Array<string>
  devtool?: Configuration['devtool']
  target?: Configuration['target']
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
    target: config.target || 'node',
  }
}
