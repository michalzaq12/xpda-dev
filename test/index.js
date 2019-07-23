
const path = require('path');
const {Pipeline} = require('../lib');


const pipe = Pipeline.createInstance({
    isDevelopment: true,
    isProduction: false,
    entryFile: path.join(__dirname, './data/dummyMain.js')
});


pipe.build();
