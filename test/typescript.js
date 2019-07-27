const path = require('path');
const {Pipeline, Logger, Webpack, Electron} = require('../lib');



const launcher = new Electron({
  logger: new Logger('Electron', 'green'),
  entryFile: path.join(__dirname, './outElectron/index.js')
})



const webpackConfig = Webpack.getTypescriptConfig({
  tsconfig: path.join(__dirname, './data/tsconfig.json'),
  mode: "development",
  entry: path.join(__dirname, './data/electronTS.ts'),
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
