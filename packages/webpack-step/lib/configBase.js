"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseConfig = void 0;
function getBaseConfig(config) {
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
    };
}
exports.getBaseConfig = getBaseConfig;
