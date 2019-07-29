const path = require('path');
const {Pipeline, Logger, Webpack, ElectronLauncher} = require('../../lib/index');



const launcher = new ElectronLauncher({
  logger: new Logger('Electron', 'green'),
  entryFile: path.join(__dirname, '../out/electron-typescript/index.js')
})



const webpackConfig = Webpack.getTypescriptConfig({
  tsconfig: path.join(__dirname, '../fixtures/electron-typescript/tsconfig.json'),
  entry: path.join(__dirname, '../fixtures/electron-typescript/index.ts'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../out/electron-typescript'),
  }
})

const webpackStep = new Webpack({
  logger: new Logger('webpack', 'red'),
  webpackConfig: webpackConfig,
  launcher: launcher
})


const pipe = new Pipeline({
  title: 'webpack-typescript',
  isDevelopment: true,
  steps: [webpackStep],
  launcher: launcher,
});


pipe.build();
