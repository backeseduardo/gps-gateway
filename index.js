const server = require('./src/server.factory');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

async function start() {
  await server(args.port, args.adapter);
}

start();