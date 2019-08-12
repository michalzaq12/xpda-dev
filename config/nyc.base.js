const LERNA = process.env.LERNA;
const path = require('path');

module.exports =  {
  extends: '@istanbuljs/nyc-config-typescript',
  clean: !LERNA, // merge reports from multiple packages
  'temp-dir': LERNA ? path.join(__dirname, '../.nyc_output') : './.nyc_output', // repo root or relative to specific package
  include: [
    'src/**/*.ts'
  ],
  all: true
}
