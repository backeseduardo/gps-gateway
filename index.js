const server = require('./src/server.factory');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const db = require('sqlite');

Promise.resolve()
  .then(() => db.open('./database.sqlite', { Promise }))
  // .then(() => db.migrate({ force: 'last' }))
  .catch(err => console.error(err.stack))
  .finally(() => server(args.port, args.adapter));
