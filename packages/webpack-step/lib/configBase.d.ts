import type { Configuration } from 'webpack';
export interface IWebpackConfigBase {
    entry: Configuration['entry'];
    externals?: Configuration['externals'];
    output: Configuration['output'];
    module?: Configuration['module'];
    plugins?: Configuration['plugins'];
    extensions?: Array<string>;
    devtool?: Configuration['devtool'];
    target?: Configuration['target'];
}
export declare function getBaseConfig(config: IWebpackConfigBase): Configuration;
