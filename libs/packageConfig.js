var npmPackage = require('../package.json');

var appName = npmPackage.name;
var port = npmPackage.config.port;
var prefix = appName.toLowerCase().replace(/[-.]/g, '');

// used for webpack-dev-server
var staticPort = 0;
var staticPrefix = 'assets';

if (port > 65535 - 10000) {
  staticPort = port - 10000;
} else {
  staticPort = port + 10000;
}

module.exports = {
  port: port,
  prefix: prefix,
  staticPort: staticPort,
  staticPrefix: staticPrefix
};
