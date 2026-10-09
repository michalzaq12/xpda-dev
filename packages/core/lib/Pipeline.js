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
exports.Pipeline = void 0;
const utils_1 = require("./utils");
const _1 = require(".");
class Pipeline {
    constructor(config) {
        this.config = config;
        this.isDev = config.isDevelopment;
        this.title = config.title || 'xpda-dev';
        this.builder = config.builder || null;
        this.launcher = config.launcher || null;
        this.steps = config.steps || [];
        this.logger =
            config.pipelineLogger || new _1.PipelineLogger({ title: this.title, disableSpinner: process.env.CI === 'true' });
        this.validate();
        this.init();
    }
    validate() {
        if (this.config.buildOnlySteps)
            return;
        if (this.isDev && this.launcher === null)
            throw new _1.PipelineError('You must pass launcher instance in development mode');
        if (!this.isDev && this.builder === null)
            throw new _1.PipelineError('You must pass builder instance in production mode');
    }
    init() {
        this.steps.forEach(step => step.logger.setPipelineLogger(this.logger));
        if (this.builder !== null)
            this.builder.logger.setPipelineLogger(this.logger);
        if (this.config.attachToProcess)
            (0, utils_1.onProcessExit)(this.stop.bind(this));
        if (this.launcher === null)
            return;
        this.launcher.logger.setPipelineLogger(this.logger);
        this.launcher.on('relaunch', () => this.logger.spinnerInfo('Relaunching electron... '));
        this.launcher.on('exit', () => __awaiter(this, void 0, void 0, function* () {
            this.logger.spinnerInfo('Killing all processes... (reason: launcher close event) ');
            this.stop();
        }));
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const step of this.steps)
                yield step.terminate();
            this.steps = [];
            yield this.launcher.exit();
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.spinnerStart('Starting ...');
            const promises = [];
            this.steps.forEach(builder => {
                promises.push(builder.build(this.isDev));
            });
            return Promise.all(promises)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                this.logger.spinnerSucceed('All steps completed.');
                if (this.config.buildOnlySteps)
                    return;
                try {
                    if (this.isDev)
                        yield this.buildDevelopment();
                    else {
                        yield this.buildProduction();
                        process.exit(0);
                    }
                }
                catch (e) {
                    this.logger.spinnerFail(e);
                    process.exit(1);
                }
            }))
                .catch((e) => __awaiter(this, void 0, void 0, function* () {
                this.logger.spinnerFail(e);
                process.exit(1);
            }));
        });
    }
    buildDevelopment() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.launcher.launch();
            this.logger.spinnerInfo('Waiting for file changes ...');
        });
    }
    buildProduction() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.spinnerStart('Building app for distribution');
            yield this.builder.build();
            this.logger.spinnerSucceed('Build completed');
        });
    }
}
exports.Pipeline = Pipeline;
