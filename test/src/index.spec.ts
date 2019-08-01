import test from 'ava'
import { Pipeline } from '../../src'
import { getBuilderStub, getLauncherStub, getPipelineLoggerStub, getStepStub } from './mocks'
import { PipelineError } from '../../src/error/PipelineError'

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
  t.true(step1.build.withArgs(true).calledOnce)
  //@ts-ignore
  t.true(step2.build.calledOnce)
  //@ts-ignore
  t.true(step2.build.withArgs(true).calledOnce)
  //@ts-ignore
  t.true(launcher.launch.calledOnce)
  //@ts-ignore
  t.true(builder.build.notCalled)
})

test('development - stop', async t => {
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
  await pipeline.stop()

  //@ts-ignore
  t.true(step1.terminate.calledOnce)
  //@ts-ignore
  t.true(step2.terminate.calledOnce)
  //@ts-ignore
  t.true(launcher.exit.calledOnce)
})

test('production', async t => {
  const step1 = getStepStub()
  const step2 = getStepStub()
  const launcher = getLauncherStub()
  const builder = getBuilderStub()

  const pipeline = new Pipeline({
    isDevelopment: false,
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
  t.true(step1.build.withArgs(false).calledOnce)
  //@ts-ignore
  t.true(step2.build.calledOnce)
  //@ts-ignore
  t.true(step2.build.withArgs(false).calledOnce)
  //@ts-ignore
  t.true(builder.build.calledOnce)
  //@ts-ignore
  t.true(launcher.launch.notCalled)
})

test('invalid options - missing launcher in dev mode', async t => {
  try {
    new Pipeline({
      isDevelopment: true,
      attachToProcess: false,
      pipelineLogger: getPipelineLoggerStub(),
    })
    t.fail()
  } catch (e) {
    t.true(e instanceof PipelineError)
  }
})

test('invalid options - missing builder in production mode', async t => {
  try {
    new Pipeline({
      isDevelopment: false,
      attachToProcess: false,
      pipelineLogger: getPipelineLoggerStub(),
    })
    t.fail()
  } catch (e) {
    t.true(e instanceof PipelineError)
  }
})
