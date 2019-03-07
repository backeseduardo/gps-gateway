module.exports = (deps) => (port) => {
  const { net } = deps;
  const connections = [];
  const server = net.createServer(conn => {
    connections.push(conn);
    console.log('new connection');
  
    conn.on('data', data => {
      console.log(data.toString('utf8'));
    });
  
    conn.on('end', () => {
      connections.splice(connections.indexOf(conn), 1);
      console.log('connection closed');
    });
  });
  server.listen(port, () => {
    console.log(`server created at port ${port}`);
  });
};