import { IWebpackConfigBase } from './configBase';
import { Configuration } from 'webpack';
export interface IWebpackConfigBabel extends IWebpackConfigBase {
}
export declare function getBabelConfig(config: IWebpackConfigBabel): Configuration;
