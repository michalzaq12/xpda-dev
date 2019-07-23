
const path = require('path');
const {Pipeline, Logger} = require('../lib');
const {Webpack} = require('../lib/step');
const {Electron} = require('../lib/launcher');



const launcher = new Electron({
  entryFile: path.join(__dirname, './data/dummyMain.js')
}, new Logger('Electron', 'green'))


const pipe = new Pipeline({
    isDevelopment: true,
    launcher: launcher
});

pipe.addStep(new Webpack({}, new Logger('webpack', 'red')))


pipe.build();
