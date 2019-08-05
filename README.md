<div align="center">
 
  <br>

<a href="https://travis-ci.org/michalzaq12/xpda-dev"><img src="https://img.shields.io/travis/michalzaq12/xpda-dev?style=flat-square"/></a>
<a href="https://coveralls.io/github/michalzaq12/xpda-dev"><img src="https://img.shields.io/coveralls/github/michalzaq12/xpda-dev?style=flat-square"/></a>

  <h1>xpda-dev</h1>
  <p>
     Cross platform desktop app development tools
  </p>
  <small>
  <i>Everything in xpda-dev is based on high level abstraction, so you can easily write own implementation</i>
  </small>
</div> 
 
 
<h2 align="center">Install</h2>

Install with npm:

```bash
npm install --save-dev xpda-dev
```

<h2 align="center">Concepts</h2>

### Steps

Step allows you to build or do everything you wish with your application to make it ready to use.

**Each step must implement [IStep](https://github.com/michalzaq12/xpda-dev/blob/963cfa88529d22761119e8396f4734fcd6e6b0b5/src/steps/IStep.ts) interface**

| Name    | Description                                                            | Constructor options                                                                                                                       | Requirements |
| ------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Webpack | Transpile your code with [webpack](https://github.com/webpack/webpack) | [IWebpackOptions](https://github.com/michalzaq12/xpda-dev/blob/963cfa88529d22761119e8396f4734fcd6e6b0b5/src/steps/webpack/Webpack.ts#L19) | -            |

### Launcher

Launcher allows you to run application when all steps completed (step may fail). _Launcher works only in development mode._

**Launcher must implement [ILauncher]() interface**

| Name             | Description                                             | Options                                                                                                                                   | Requirements           |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| ElectronLauncher | Launch [electron](https://github.com/electron/electron) | [IWebpackOptions](https://github.com/michalzaq12/xpda-dev/blob/963cfa88529d22761119e8396f4734fcd6e6b0b5/src/steps/webpack/Webpack.ts#L19) | `"electron": "^5.0.0"` |

<h2 align="center">Examples</h2>

- Electron cross platform app. Main process was written with help of Typescript

```javascript
const { Pipeline, Webpack, ElectronLauncher } = require('xpda-dev')

const launcher = new ElectronLauncher({
  entryFile: './dist/index.js',
})

const webpackConfig = Webpack.getTypescriptConfig({
  tsconfig: './tsconfig.json',
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: './dist',
  },
})

const webpackStep = new Webpack({
  webpackConfig: webpackConfig,
  launcher: launcher,
})

const pipe = new Pipeline({
  title: 'electron-pipeline',
  isDevelopment: true,
  steps: [webpackStep],
  launcher: launcher,
})

pipe.run()
```
