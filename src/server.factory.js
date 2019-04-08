const net = require('net');
const db = require('sqlite');
const server = require('./server');
module.exports = server({ net, db });