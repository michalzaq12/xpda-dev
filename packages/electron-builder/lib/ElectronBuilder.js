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
exports.ElectronBuilder = void 0;
const core_1 = require("@xpda-dev/core");
const execa = require("execa");
class ElectronBuilder {
    constructor(options) {
        this.options = options;
        this.logger = options.logger || new core_1.Logger('Electron-builder', 'teal');
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const argumentsArray = this.options.processArgv || process.argv.slice(2);
            try {
                const subProcess = execa('electron-builder', argumentsArray);
                subProcess.stdout.pipe(this.logger.stdout);
                subProcess.stderr.pipe(this.logger.stdout);
                yield subProcess;
            }
            catch (e) {
                this.logger.error(e);
                throw new core_1.PipelineError('Error occurred when building application');
            }
        });
    }
}
exports.ElectronBuilder = ElectronBuilder;
