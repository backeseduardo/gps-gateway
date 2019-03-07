const net = require('net');
const serverFactory = require('./server.factory');
module.exports = serverFactory({ net });