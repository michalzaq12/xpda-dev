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
npm install --save-dev @xpda-dev/core
```

<h2 align="center">Concepts</h2>

### Steps

Step allows you to build or do everything you wish with your application to make it ready to use.

**Each step must implement [IStep](https://github.com/michalzaq12/xpda-dev/blob/master/packages/core/src/IStep.ts) interface**

| Name    | Description                                                            | Constructor options                                                                                            | Requirements                                                                   |
| ------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Webpack | Transpile your code with [webpack](https://github.com/webpack/webpack) | [IWebpackOptions](https://github.com/michalzaq12/xpda-dev/blob/master/packages/webpack-step/src/Webpack.ts#L8) | [@xpda-dev/webpack-step](https://www.npmjs.com/package/@xpda-dev/webpack-step) |

### Launcher

Launcher allows you to run application when all steps completed (step may fail). _Launcher works only in development mode._

**Launcher must implement [ILauncher](https://github.com/michalzaq12/xpda-dev/blob/master/packages/core/src/ILauncher.ts) interface**

| Name             | Description                                             | Options                                                                                                                       | Requirements                                                                             |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ElectronLauncher | Launch [electron](https://github.com/electron/electron) | [IElectronOptions](https://github.com/michalzaq12/xpda-dev/blob/master/packages/electron-launcher/src/ElectronLauncher.ts#L6) | [@xpda-dev/electron-launcher](https://www.npmjs.com/package/@xpda-dev/electron-launcher) |

### Launcher

// TODO

<h2 align="center">Examples</h2>

- Electron cross platform app. Main process was written with help of Typescript

```javascript
const electron = require('electron')
const { Pipeline } = require('@xpda-dev/core')
const { Webpack } = require('@xpda-dev/webpack-step')
const { ElectronLauncher } = require('@xpda-dev/electron-launcher')

const launcher = new ElectronLauncher({
  entryFile: './dist/index.js',
  electronPath: electron,
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
