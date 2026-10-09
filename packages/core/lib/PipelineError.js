"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineError = void 0;
class PipelineError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.PipelineError = PipelineError;
