const net = require('net');
const messages = [
  '*ET,01234,RG,13691779574#',
  // '*ET,01234,HB,A,130208,0c1007,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c1024,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c1107,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c1125,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c2a07,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,TX,A,130208,0c2a1f#',
  // '*ET,01234,HB,A,130208,0d3126,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d3208,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,TX,A,130208,0d3222#',
  // '*ET,01234,HB,A,130208,0d0826,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0908,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0926,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0a08,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0a26,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0b08,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0b26,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1325,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1408,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1426,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1508,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1526,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d1607,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,TX,A,130208,0d161b#',
  // '*ET,01234,HB,A,130208,0d1625,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,TX,A,130208,0d1639#',
  // '*ET,01234,HB,A,130208,0d1708,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3726,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3808,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3825,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3907,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3926,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0c3a08,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#',
  // '*ET,01234,TX,A,130208,0c3a25#',
  // '*ET,01234,TX,A,130208,0c3b07#',
  // '*ET,01234,MQ#',
  // '*ET,01234,HB,A,130208,0d0407,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,HB,A,130208,0d0426,81033017,81e35163,0000,0000,00000000,1e,100,0000,9514,581#',
  // '*ET,01234,MQ#',
  // '*ET,01234,HB,A,130208,0d0508,81033017,81e35163,0000,0000,00000000,1d,100,0000,9514,581#'
];

messages.forEach(message => {
  const client = new net.Socket();

  client.connect('8080', '127.0.0.1', () => {
    console.log('connected');
    client.write(message);

    if (message.indexOf('MQ') > -1) {
      
    } else {
      client.end();
    }
  });

  client.on('data', (data) => {
    console.log(`RECEIVED: ${data}`);

    client.end();
  });

  client.on('close', () => {
    console.log('connection closed');
  });
});