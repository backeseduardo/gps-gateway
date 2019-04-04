const net = require('net');

const client = new net.Socket();
let isAlive = false;

client.connect('8080', '127.0.0.1', () => {
  console.log('connected');
  client.write('01hello');

  isAlive = true;

  const intervalId = setInterval(() => {
    if (isAlive) {
      const randomNum = Math.random() * 1000;
      client.write(`01${randomNum}`);
    } else {
      clearInterval(intervalId);
    }
  }, 100);
});

client.on('data', (data) => {
  console.log(`RECEIVED: ${data}`);
});

client.on('close', () => {
  console.log('connection closed');
});