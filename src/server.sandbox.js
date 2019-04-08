const net = require('net');
const db = require('sqlite');
const server = require('./server');

server({ net, db })(8080, 'adapter01');