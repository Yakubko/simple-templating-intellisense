/* eslint-disable @typescript-eslint/no-var-requires */
const env = process.env.NODE_ENV;

const production = require('./config/webpack/production');
const development = require('./config/webpack/development');

module.exports = env === 'production' ? production : development;
