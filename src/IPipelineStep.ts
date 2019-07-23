export interface IPipelineStep {
  build(isDev: boolean): Promise<void>
  terminate(): Promise<void>
}
