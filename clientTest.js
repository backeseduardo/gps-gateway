const net = require('net');

const client = new net.Socket();
let isAlive = false;

client.connect('8080', '127.0.0.1', () => {
  console.log('connected');
  client.write('*ET,01234,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#');

  isAlive = true;

  // const intervalId = setInterval(() => {
  //   if (isAlive) {
  //     const randomNum = Math.random() * 1000;
  //     client.write(`01${randomNum}`);
  //   } else {
  //     clearInterval(intervalId);
  //   }
  // }, 100);
});

client.on('data', (data) => {
  console.log(`RECEIVED: ${data}`);
});

client.on('close', () => {
  console.log('connection closed');
});