const net = require('net');
const server = require('./server');

server({ net })(8080);