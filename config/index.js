const env = process.env.NODE_ENV;
const defaultConfig = require('./default');
const devConfig = require('./dev');
const prodConfig = require('./prod');

let appConfig;

switch (env) {
  case 'development':
    appConfig = devConfig;
    break;
  case 'production':
    appConfig = prodConfig;
    break;
  default:
    appConfig = defaultConfig;
}

module.exports = appConfig;
