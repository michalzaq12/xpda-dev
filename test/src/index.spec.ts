import anyTest, { TestInterface } from 'ava'
import { Pipeline, ILogger, ILauncher, IStep, IPipelineLogger } from '../../src'
import { getBuilderStub, getLauncherStub, getLoggerStub, getPipelineLoggerStub, getStepStub } from './mocks'

const test = anyTest as TestInterface<{
  logger: ILogger
  launcher: ILauncher
  step: IStep
  pipelineLogger: IPipelineLogger
}>

test.beforeEach(t => {
  t.context = {
    logger: getLoggerStub(),
    launcher: getLauncherStub(),
    step: getStepStub(),
    pipelineLogger: getPipelineLoggerStub(),
  }
})

test('development', async t => {
  const step1 = getStepStub()
  const step2 = getStepStub()
  const launcher = getLauncherStub()
  const builder = getBuilderStub()

  const pipeline = new Pipeline({
    isDevelopment: true,
    attachToProcess: false,
    steps: [step1, step2],
    launcher: launcher,
    builder: builder,
    pipelineLogger: getPipelineLoggerStub(),
  })

  await pipeline.build()

  //@ts-ignore
  t.true(step1.build.calledOnce)
  //@ts-ignore
  t.true(step2.build.calledOnce)
  //@ts-ignore
  t.true(launcher.launch.calledOnce)
  //@ts-ignore
  t.true(builder.build.notCalled)
})
