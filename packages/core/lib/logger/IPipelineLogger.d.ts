export interface IPipelineLogger {
    spinnerStart(text: string): any;
    spinnerSucceed(text: string): any;
    spinnerFail(error: Error | string): any;
    spinnerInfo(text: string): any;
    log(title: string, color: string, text: string, textColor?: string): any;
}
