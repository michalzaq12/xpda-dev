export interface IStep {
  build(isDev: boolean): Promise<void>
  terminate(): Promise<void>
}
