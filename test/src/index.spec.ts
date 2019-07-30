import anyTest, { TestInterface } from 'ava'
import { Pipeline, ILogger, ILauncher, IStep, IPipelineLogger } from '../../src'
import { launcher } from './mocks/launcher'
import { logger } from './mocks/logger'
import { step } from './mocks/step'
import { pipelineLogger } from './mocks/pipelineLogger'

const test = anyTest as TestInterface<{
  loggerMock: ILogger
  launcherMock: ILauncher
  stepMock: IStep
  pipelineLogger: IPipelineLogger
}>

test.beforeEach(t => {
  t.context = {
    loggerMock: logger,
    launcherMock: launcher,
    stepMock: step,
    pipelineLogger: pipelineLogger,
  }
})

test('pipeline should call step build function once', async t => {
  const pipeline = new Pipeline({
    title: 'test',
    isDevelopment: true,
    steps: [t.context.stepMock],
    launcher: t.context.launcherMock,
    pipelineLogger: t.context.pipelineLogger,
  })

  //sinon.spy(t.context.stepMock, 'build');

  await pipeline.build()

  //@ts-ignore
  t.true(t.context.stepMock.build.calledOnce)
})
