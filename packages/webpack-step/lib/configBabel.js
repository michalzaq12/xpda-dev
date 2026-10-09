"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBabelConfig = void 0;
const configBase_1 = require("./configBase");
function getBabelConfig(config) {
    const webpackConfig = (0, configBase_1.getBaseConfig)(config);
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
    });
    return webpackConfig;
}
exports.getBabelConfig = getBabelConfig;
