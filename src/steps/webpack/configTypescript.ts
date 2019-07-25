import { IWebpackConfigBase } from './configBase'
import { getBaseConfig } from './configBase'
import { Configuration } from 'webpack'

export interface IWebpackConfigTypescript extends IWebpackConfigBase {
  tsconfig?: string
  sourcemap?: boolean
}

export function getTypescriptConfig(config: IWebpackConfigTypescript): Configuration {
  const webpackConfig = getBaseConfig(config)
  webpackConfig.resolve.extensions = ['.tsx', '.ts', '.js', '.json', '.node']
  if (config.sourcemap) webpackConfig.devtool = 'inline-source-map'
  webpackConfig.module.rules.push({
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          configFile: config.tsconfig || 'tsconfig.json',
        },
      },
    ],
    exclude: /node_modules/,
  })
  return webpackConfig
}
