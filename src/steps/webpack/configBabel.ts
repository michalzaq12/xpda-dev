import { IWebpackConfigBase } from './configBase'
import { getBaseConfig } from './configBase'

export interface IWebpackConfigBabel extends IWebpackConfigBase {}

export function getBabelConfig(config: IWebpackConfigBabel) {
  const webpackConfig = getBaseConfig(config)
  webpackConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    // @ts-ignore
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
