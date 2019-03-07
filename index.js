const server = require('./src/server');
const args = require('minimist')(process.argv.slice(2));

server(args.port);
