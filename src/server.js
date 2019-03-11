module.exports = (deps) => (port, adapterString) => {
  // the adapter could be passed as a dependency too
  const { net } = deps;
  const connections = [];
  const availableAdapters = {
    adapter01: './adapter/adapter01'
  }

  const server = net.createServer(conn => {
    const adapter = require(availableAdapters[adapterString])
    // it will pass the adapter as device dependency
    conn.device = require('./device.factory')(adapter, conn);

    connections.push(conn);
    console.log('new connection');
  
    conn.on('data', async data => {
      try {
        await conn.device.data(data);
      } catch (e) {
        console.log(`[error] ${e}`);
        await conn.device.end();
        conn.end();
      }
    });
  
    conn.on('end', async () => {
      connections.splice(connections.indexOf(conn), 1);
      console.log('connection closed');
    });
  });
  server.listen(port, () => {
    console.log(`server created at port ${port}`);
  });
};