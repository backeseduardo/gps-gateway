const net = require('net');
const serverFactory = require('./server.factory');

const server = serverFactory({ net });
server(8080);