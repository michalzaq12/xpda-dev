"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypescriptConfig = void 0;
const configBase_1 = require("./configBase");
function getTypescriptConfig(config) {
    const webpackConfig = (0, configBase_1.getBaseConfig)(config);
    webpackConfig.resolve.extensions.push('.tsx', '.ts');
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
    });
    return webpackConfig;
}
exports.getTypescriptConfig = getTypescriptConfig;
