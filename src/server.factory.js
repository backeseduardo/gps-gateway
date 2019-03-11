const net = require('net');
const server = require('./server');
module.exports = server({ net });