export interface IPipelineLogger {
  spinnerStart(text: string)
  spinnerSucceed(text: string)
  spinnerFail(error: Error | string)
  spinnerInfo(text: string)
  log(title: string, color: string, text: string, textColor?: string)
}
