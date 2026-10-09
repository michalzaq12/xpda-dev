/// <reference types="node" />
type WritableStream = NodeJS.WritableStream;
import { IPipelineLogger } from '../index';
export interface IPipelineLoggerOptions {
    title: string;
    stream?: WritableStream;
    disableSpinner?: boolean;
}
export declare class PipelineLogger implements IPipelineLogger {
    readonly options: IPipelineLoggerOptions;
    private readonly stream;
    private spinner;
    private staticSpinner;
    private lastActiveTitle;
    constructor(options: IPipelineLoggerOptions);
    private initSpinners;
    private formatSpinnerTitle;
    private printTitle;
    spinnerFail(error: Error | string): void;
    spinnerInfo(text: string): void;
    spinnerStart(text: string): void;
    spinnerSucceed(text: string): void;
    private writeToStream;
    private static colorText;
    log(title: string, titleColor: string, text: string, textColor?: string): void;
}
export {};
