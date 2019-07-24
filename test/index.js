
const path = require('path');
const {Pipeline, Logger} = require('../lib');
const {Webpack} = require('../lib/step');
const {Electron} = require('../lib/launcher');



const launcher = new Electron({
  entryFile: path.join(__dirname, './outElectron/index.js')
}, new Logger('Electron', 'green'))


const pipe = new Pipeline({
    isDevelopment: true,
    launcher: launcher
});


const webpackConfig = Webpack.getBaseConfig({
  mode: "development",
  entry: path.join(__dirname, './data/dummyElectron.js'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './outElectron'),
  }
})

pipe.addStep(new Webpack(webpackConfig, new Logger('webpack', 'red')))


pipe.build();
