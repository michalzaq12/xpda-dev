const path = require('path');
const {Pipeline, Logger, ElectronBuilder, Webpack, Electron} = require('../lib');


const launcher = new Electron({
  logger: new Logger('Electron', 'green'),
  entryFile: path.join(__dirname, './outElectron/index.js')
})



const webpackConfig = Webpack.getBaseConfig({
  entry: path.join(__dirname, './data/electronJS.js'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './outElectron'),
  }
})

const webpackStep = new Webpack({
  logger: new Logger('webpack', 'red'),
  webpackConfig: webpackConfig,
  launcher: launcher
})

const builder = new ElectronBuilder({
  logger: new Logger('Electron-builder', 'teal')
})

const pipe = new Pipeline({
  isDevelopment: false,
  steps: [webpackStep],
  launcher: launcher,
  builder: builder
});


pipe.build();
