import anyTest, { TestInterface } from 'ava'
import { Pipeline, ILogger, ILauncher, IStep, IPipelineLogger } from '../../src'
import { launcherStub, loggerStub, stepStub, pipelineLoggerStub } from './mocks'

const test = anyTest as TestInterface<{
  logger: ILogger
  launcher: ILauncher
  step: IStep
  pipelineLogger: IPipelineLogger
}>

test.beforeEach(t => {
  t.context = {
    logger: loggerStub,
    launcher: launcherStub,
    step: stepStub,
    pipelineLogger: pipelineLoggerStub,
  }
})

test('pipeline should call step build function once', async t => {
  const pipeline = new Pipeline({
    title: 'test',
    isDevelopment: true,
    steps: [t.context.step],
    launcher: t.context.launcher,
    pipelineLogger: t.context.pipelineLogger,
  })

  await pipeline.build()

  //@ts-ignore
  t.true(t.context.step.build.calledOnce)
  //@ts-ignore
  t.true(t.context.launcher.launch.calledOnce)
})
