const path = require('path');
const {Pipeline, Webpack, ElectronLauncher} = require('../../lib/index');



const launcher = new ElectronLauncher({
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
