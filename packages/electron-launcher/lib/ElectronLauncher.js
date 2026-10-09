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
exports.ElectronLauncher = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
const core_1 = require("@xpda-dev/core");
const { killWithAllSubProcess } = core_1.utils;
class ElectronLauncher extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.process = null;
        this.electronPath = options.electronPath;
        this.electronOptions = options.electronOptions || [];
        this.entryFile = options.entryFile;
        this.relaunchCode = options.relaunchCode || 250;
        this.inspectionPort = options.inspectionPort || 5858;
        this.logger = options.logger || new core_1.Logger('Electron', 'teal');
        this.logger.ignore(text => text.includes('source: chrome-devtools://devtools/bundled/shell.js (108)'));
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            let args = [`--inspect=${this.inspectionPort}`, this.entryFile, '--auto-detect=false', '--no-proxy-server', ...this.electronOptions];
            this.process = (0, child_process_1.spawn)(this.electronPath, args);
            this.pipe(this.logger);
            this.process.on('exit', code => {
                if (code === this.relaunchCode)
                    this.relaunch();
                else {
                    this.exit();
                    this.emit('exit', code);
                }
            });
        });
    }
    get isRunning() {
        return this.process !== null;
    }
    get pid() {
        if (!this.isRunning)
            return undefined;
        else
            return this.process.pid;
    }
    relaunch() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning)
                return;
            this.emit('relaunch');
            yield this.exit();
            this.launch();
        });
    }
    exit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning)
                return;
            this.process.removeAllListeners('exit');
            this.process.stdout.end();
            this.process.stderr.end();
            yield killWithAllSubProcess(this.pid, this.logger.error.bind(this.logger));
            this.process = null;
        });
    }
    pipe(logger) {
        if (!this.isRunning)
            return;
        this.process.stdout.pipe(logger.stdout);
        this.process.stderr.pipe(logger.stdout);
    }
}
exports.ElectronLauncher = ElectronLauncher;
