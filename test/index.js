
const path = require('path');
const {Pipeline} = require('../lib');


const pipe = new Pipeline({
    isDevelopment: true,
    isProduction: false,
    electron: {
      entryFile: path.join(__dirname, './data/dummyMain.js')
    }
});


pipe.build();
