const path = require('path');
const {Pipeline, Logger} = require('../lib');
const {Webpack} = require('../lib/step');
const {Electron} = require('../lib/launcher');



const launcher = new Electron({
  logger: new Logger('Electron', 'green'),
  entryFile: path.join(__dirname, './outElectron/index.js')
})



const webpackConfig = Webpack.getBaseConfig({
  mode: "development",
  entry: path.join(__dirname, './data/dummyElectron.js'),
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


const pipe = new Pipeline({
  isDevelopment: true,
  steps: [webpackStep],
  launcher: launcher,
});


pipe.build();
