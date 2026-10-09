/// <reference types="node" />
import { EventEmitter } from 'events';
import { ILogger, ILauncher } from '@xpda-dev/core';
export interface IElectronOptions {
    electronPath: string;
    electronOptions?: string[];
    entryFile: string;
    logger?: ILogger;
    inspectionPort?: number;
    relaunchCode?: number;
}
export declare class ElectronLauncher extends EventEmitter implements ILauncher {
    readonly logger: ILogger;
    readonly relaunchCode: number;
    readonly inspectionPort: number;
    readonly electronPath: string;
    readonly electronOptions: string[];
    readonly entryFile: string;
    private process;
    constructor(options: IElectronOptions);
    launch(): Promise<void>;
    get isRunning(): boolean;
    get pid(): number;
    relaunch(): Promise<void>;
    exit(): Promise<void>;
    private pipe;
}
