"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webpack = void 0;
const webpack_1 = require("webpack");
const configBase_1 = require("./configBase");
const configTypescript_1 = require("./configTypescript");
const core_1 = require("@xpda-dev/core");
class Webpack {
    constructor(options) {
        this.watching = null;
        this.launcher = null;
        this.logger = options.logger || new core_1.Logger('Webpack', 'olive');
        this.webpackConfig = options.webpackConfig;
        this.launcher = options.launcher;
    }
    build(isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this.webpackConfig.mode = isDev ? 'development' : 'production';
            this.webpackConfig.node = {
                __filename: isDev,
                __dirname: isDev,
            };
            this.compiler = (0, webpack_1.webpack)(this.webpackConfig);
            return isDev ? this.watch() : this.run();
        });
    }
    terminate() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (this.watching === null)
                    resolve();
                else
                    this.watching.close(() => {
                        this.watching = null;
                        resolve();
                    });
            });
        });
    }
    logStats(stats) {
        this.logger.info(stats.toString({
            colors: true,
            chunks: false,
        }));
    }
    watch() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.watching = this.compiler.watch({ ignored: /node_modules/, aggregateTimeout: 3000 }, (err, stats) => {
                    if (err)
                        this.logger.error(err.message);
                    else {
                        this.logStats(stats);
                        if (this.launcher)
                            this.launcher.relaunch();
                    }
                    resolve();
                });
            });
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.compiler.run((err, stats) => {
                    this.logStats(stats);
                    if (err || stats.hasErrors())
                        reject(new core_1.PipelineError('Webpack stats contains error'));
                    resolve();
                });
            });
        });
    }
    static getBaseConfig(config) {
        return (0, configBase_1.getBaseConfig)(config);
    }
    static getTypescriptConfig(config) {
        return (0, configTypescript_1.getTypescriptConfig)(config);
    }
}
exports.Webpack = Webpack;
