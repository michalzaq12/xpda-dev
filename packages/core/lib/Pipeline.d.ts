import { IBuilder, ILauncher, IStep, IPipelineLogger } from '.';
export interface IConfig {
    isDevelopment: boolean;
    title?: string;
    launcher?: ILauncher;
    builder?: IBuilder;
    pipelineLogger?: IPipelineLogger;
    steps?: Array<IStep>;
    attachToProcess?: boolean;
    buildOnlySteps?: boolean;
}
export declare class Pipeline {
    readonly config: IConfig;
    private readonly title;
    private readonly isDev;
    private readonly builder;
    private readonly launcher;
    private steps;
    private readonly logger;
    constructor(config: IConfig);
    private validate;
    private init;
    stop(): Promise<void>;
    run(): Promise<void>;
    private buildDevelopment;
    private buildProduction;
}
