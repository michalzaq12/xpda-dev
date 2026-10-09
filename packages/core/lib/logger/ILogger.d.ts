/// <reference types="node" />
type WritableStream = NodeJS.WritableStream;
import { IPipelineLogger } from './IPipelineLogger';
export interface ILogger {
    readonly stdout: WritableStream;
    readonly stderr: WritableStream;
    info(text: string): any;
    error(text: string): any;
    ignore(test: (text: string) => boolean): any;
    setPipelineLogger(pipelineLogger: IPipelineLogger): any;
}
export {};
