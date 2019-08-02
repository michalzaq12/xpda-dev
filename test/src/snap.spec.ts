import anyTest, { TestInterface } from 'ava'
import * as path from 'path'
import * as fs from 'fs'
import * as tmp from 'tmp'
import { Pipeline, Webpack } from '../../src'
import { getLoggerStub, getPipelineLoggerStub } from './mocks'
import { DirResult } from 'tmp'

const test = anyTest as TestInterface<{ tmpdir: DirResult }>

test.beforeEach(t => {
  t.context = {
    tmpdir: tmp.dirSync(),
  }
})

test.afterEach.always(t => {
  t.context.tmpdir.removeCallback()
})

test('electron-webpack-simple', async t => {
  const dir = t.context.tmpdir.name

  const webpackConfig = Webpack.getBaseConfig({
    entry: path.join(__dirname, '../fixtures/electron-simple/index.js'),
    output: {
      filename: 'index.js',
      path: dir,
    },
  })
  const pipeline = new Pipeline({
    buildOnlySteps: true,
    isDevelopment: true,
    steps: [new Webpack({ webpackConfig: webpackConfig, logger: getLoggerStub() })],
    pipelineLogger: getPipelineLoggerStub(),
  })

  await pipeline.build()

  const output = fs
    .readFileSync(path.join(dir, 'index.js'))
    .toString()
    .replace('\r', '')
  t.snapshot(output)
})
