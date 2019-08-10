import { IWebpackConfigBase } from './configBase'
import { getBaseConfig } from './configBase'
import { Configuration } from 'webpack'

export interface IWebpackConfigBabel extends IWebpackConfigBase {}

export function getBabelConfig(config: IWebpackConfigBabel): Configuration {
  const webpackConfig = getBaseConfig(config)
  webpackConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/env',
            {
              targets: ['electron 4.0'],
            },
          ],
        ],
      },
    },
  })
  return webpackConfig
}
