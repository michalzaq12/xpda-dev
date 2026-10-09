import { IWebpackConfigBase } from './configBase';
import { Configuration } from 'webpack';
export interface IWebpackConfigTypescript extends IWebpackConfigBase {
    tsconfig?: string;
}
export declare function getTypescriptConfig(config: IWebpackConfigTypescript): Configuration;
