import { ILogger, IBuilder } from '@xpda-dev/core';
export interface IElectronBuilderOptions {
    processArgv?: Array<any>;
    logger?: ILogger;
}
export declare class ElectronBuilder implements IBuilder {
    readonly options?: IElectronBuilderOptions;
    readonly logger: ILogger;
    constructor(options?: IElectronBuilderOptions);
    build(): Promise<void>;
}
