export interface ILogger {
  info(text: string)
  error(text: string)
  ignore(test: (text: string) => boolean)
}
