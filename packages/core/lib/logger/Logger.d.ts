/// <reference types="node" />
type WritableStream = NodeJS.WritableStream;
import { ILogger, IPipelineLogger } from '../index';
export declare class Logger implements ILogger {
    readonly name: string;
    readonly color: string;
    stdout: WritableStream;
    stderr: WritableStream;
    private ignoreFunctions;
    private pipelineLogger;
    private errorLogger;
    private stdoutBuffer;
    private stderrBuffer;
    constructor(name: string, color: string);
    private initStream;
    info(text: string, color?: string): void;
    error(text: Error | string): void;
    ignore(test: (text: string) => boolean): void;
    setPipelineLogger(pipelineLogger: IPipelineLogger): void;
}
export {};
