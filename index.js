const server = require('./src/server');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

server(args.port);
