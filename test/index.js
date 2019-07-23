
const path = require('path');
const {Pipeline, Logger} = require('../lib');
const {Webpack} = require('../lib/steps');


const pipe = new Pipeline({
    isDevelopment: true,
    isProduction: false,
    electron: {
      entryFile: path.join(__dirname, './data/dummyMain.js')
    }
});

pipe.addStep(new Webpack({}, new Logger('webpack', 'red')))


pipe.build();
