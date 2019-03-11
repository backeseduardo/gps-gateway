module.exports = (deps) => (port, adapter) => {
  // the adapter could be passed as a dependency too
  const { net } = deps;
  const connections = [];
  const availableAdapters = {
    rst1000: './adapter/rst1000'
  }

  const server = net.createServer(conn => {
    const adapter = require(availableAdapters[adapter])()
    // it will pass the adapter as device dependency
    conn.device = require('./device')({ adapter })(conn);

    connections.push(conn);
    console.log('new connection');
  
    conn.on('data', async data => {
      try {
        await conn.device.onData(data);
      } catch (e) {
        console.log(`[error] ${e}`);
        conn.end();
      }
    });
  
    conn.on('end', async () => {
      await conn.device.end();
      connections.splice(connections.indexOf(conn), 1);
      console.log('connection closed');
    });
  });
  server.listen(port, () => {
    console.log(`server created at port ${port}`);
  });
};