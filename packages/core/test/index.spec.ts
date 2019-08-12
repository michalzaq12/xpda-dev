import anyTest, { TestInterface } from 'ava'
import { SinonSandbox, createSandbox } from 'sinon'
import { Pipeline, PipelineError } from '../src'
import { getBuilderStub, getLauncherStub, getPipelineLoggerStub, getStepStub } from './mocks'

const test = anyTest as TestInterface<{ sandbox: SinonSandbox }>

test.beforeEach(t => {
  t.context = {
    sandbox: createSandbox(),
  }
})

test.afterEach.always(t => {
  t.context.sandbox.restore()
})

test('development', async t => {
  const sandbox = t.context.sandbox
  const step1 = getStepStub(sandbox)
  const step2 = getStepStub(sandbox)
  const launcher = getLauncherStub(sandbox)
  const builder = getBuilderStub(sandbox)

  const pipeline = new Pipeline({
    isDevelopment: true,
    attachToProcess: false,
    steps: [step1, step2],
    launcher: launcher,
    builder: builder,
    pipelineLogger: getPipelineLoggerStub(sandbox),
  })

  await pipeline.run()

  t.true(step1.build.calledOnce)
  t.true(step1.build.withArgs(true).calledOnce)
  t.true(step2.build.calledOnce)
  t.true(step2.build.withArgs(true).calledOnce)
  t.true(launcher.launch.calledOnce)
  t.true(builder.build.notCalled)
})

test('development - stop', async t => {
  const sandbox = t.context.sandbox
  const step1 = getStepStub(sandbox)
  const step2 = getStepStub(sandbox)
  const launcher = getLauncherStub(sandbox)
  const builder = getBuilderStub(sandbox)

  const pipeline = new Pipeline({
    isDevelopment: true,
    attachToProcess: false,
    steps: [step1, step2],
    launcher: launcher,
    builder: builder,
    pipelineLogger: getPipelineLoggerStub(sandbox),
  })

  await pipeline.run()
  await pipeline.stop()

  t.true(step1.terminate.calledOnce)
  t.true(step2.terminate.calledOnce)
  t.true(launcher.exit.calledOnce)
})

test('production', async t => {
  const sandbox = t.context.sandbox
  const step1 = getStepStub(sandbox)
  const step2 = getStepStub(sandbox)
  const launcher = getLauncherStub(sandbox)
  const builder = getBuilderStub(sandbox)

  const pipeline = new Pipeline({
    isDevelopment: false,
    attachToProcess: false,
    steps: [step1, step2],
    launcher: launcher,
    builder: builder,
    pipelineLogger: getPipelineLoggerStub(sandbox),
  })

  await pipeline.run()

  t.true(step1.build.calledOnce)
  t.true(step1.build.withArgs(false).calledOnce)
  t.true(step2.build.calledOnce)
  t.true(step2.build.withArgs(false).calledOnce)
  t.true(builder.build.calledOnce)
  t.true(launcher.launch.notCalled)
})

test('invalid options - missing launcher in dev mode', async t => {
  try {
    new Pipeline({
      isDevelopment: true,
      attachToProcess: false,
      pipelineLogger: getPipelineLoggerStub(t.context.sandbox),
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
      pipelineLogger: getPipelineLoggerStub(t.context.sandbox),
    })
    t.fail()
  } catch (e) {
    t.true(e instanceof PipelineError)
  }
})
