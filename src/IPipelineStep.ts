export interface IPipelineStep {
  build(): Promise<void>
  terminate(): Promise<void>
}
