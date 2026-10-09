import type { Configuration } from 'webpack';
import { IWebpackConfigBase } from './configBase';
import { IWebpackConfigTypescript } from './configTypescript';
import { ILogger, IStep, ILauncher } from '@xpda-dev/core';
export interface IWebpackOptions {
    webpackConfig: Configuration;
    logger?: ILogger;
    launcher?: ILauncher;
}
export declare class Webpack implements IStep {
    readonly logger: ILogger;
    readonly webpackConfig: Configuration;
    private compiler;
    private watching;
    private readonly launcher;
    constructor(options: IWebpackOptions);
    build(isDev: boolean): Promise<void>;
    terminate(): Promise<void>;
    private logStats;
    private watch;
    private run;
    static getBaseConfig(config: IWebpackConfigBase): Configuration;
    static getTypescriptConfig(config: IWebpackConfigTypescript): Configuration;
}
