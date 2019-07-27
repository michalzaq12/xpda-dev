export interface IPipelineLogger {
  setSpinnerTitle(text)
  spinnerStart(text?: string)
  spinnerSucceed(text: string)
  spinnerFail(error: Error | string)
  spinnerInfo(text: string)
  log(loggerName: string, loggerColor: string, text: string, textColor?: string)
  [extra: string]: any
}
