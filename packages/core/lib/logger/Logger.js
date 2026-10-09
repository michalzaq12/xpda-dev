"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const stream_1 = require("stream");
const console_1 = require("console");
class Logger {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.ignoreFunctions = [];
        this.stdoutBuffer = [];
        this.stderrBuffer = [];
        this.initStream();
        this.errorLogger = new console_1.Console(this.stderr);
    }
    initStream() {
        const self = this;
        this.stdout = new stream_1.Writable({
            write(chunk, encoding, callback) {
                self.stdoutBuffer.push(chunk);
                if (chunk.includes('\n')) {
                    self.info(Buffer.concat(self.stdoutBuffer).toString(encoding === 'buffer' ? undefined : encoding));
                    self.stdoutBuffer = [];
                }
                callback();
            },
        });
        this.stderr = new stream_1.Writable({
            write(chunk, encoding, callback) {
                self.stderrBuffer.push(chunk);
                if (chunk.includes('\n')) {
                    self.info(Buffer.concat(self.stderrBuffer).toString(encoding === 'buffer' ? undefined : encoding), 'red');
                    self.stderrBuffer = [];
                }
                callback();
            },
        });
        this.stdout.on('finish', () => {
            this.initStream();
        });
    }
    info(text, color) {
        for (const ignoreTest of this.ignoreFunctions)
            if (ignoreTest(text))
                return;
        this.pipelineLogger.log(this.name, this.color, text, color);
    }
    error(text) {
        this.errorLogger.error(text);
    }
    ignore(test) {
        this.ignoreFunctions.push(test);
    }
    setPipelineLogger(pipelineLogger) {
        this.pipelineLogger = pipelineLogger;
    }
}
exports.Logger = Logger;
