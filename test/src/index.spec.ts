import anyTest, { TestInterface } from 'ava'
import { Pipeline, ILogger, ILauncher, IStep, Webpack } from '../../src'
import { stubInterface, stubObject } from 'ts-sinon'
import * as sinonImport from 'ts-sinon'
import { SinonStub } from 'sinon'
const sinon = sinonImport.default

const test = anyTest as TestInterface<{
  loggerMock: ILogger
  launcherMock: ILauncher
  stepMock: IStep
  x: string
}>

test.beforeEach(t => {
  t.context = {
    x: 'asdasd',
    loggerMock: stubInterface<ILogger>(),
    launcherMock: stubInterface<ILauncher>(),
    stepMock: stubInterface<IStep>(),
  }
})

test('pipeline should call step build function once', async t => {
  console.log(t.context.stepMock.build)

  const pipeline = new Pipeline({
    title: 'test',
    isDevelopment: true,
    steps: [t.context.stepMock],
    launcher: t.context.launcherMock,
  })

  //sinon.spy(t.context.stepMock, 'build');

  await pipeline.build()

  // @ts-ignore
  t.true(t.context.stepMock.build.calledOnce)
})
