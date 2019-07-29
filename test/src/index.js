const path = require('path');
const {Pipeline, ElectronBuilder, Webpack, ElectronLauncher} = require('../../lib/index');


const launcher = new ElectronLauncher({
  entryFile: path.join(__dirname, '../out/electron-simple/index.js')
})



const webpackConfig = Webpack.getBaseConfig({
  entry: path.join(__dirname, '../fixtures/electron-simple/index.js'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../out/electron-simple'),
  }
})

const webpackStep = new Webpack({
  webpackConfig: webpackConfig,
  launcher: launcher
})

const builder = new ElectronBuilder()

const pipe = new Pipeline({
  title: 'webpack-simple',
  isDevelopment: false,
  steps: [webpackStep],
  launcher: launcher,
  builder: builder
});


pipe.build();
