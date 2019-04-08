
describe('server.test.js', () => {

  it('expect server to be initialized properly', async () => {
    const server = require('./server');
    const fakeListen = jest.fn();
    const fakeCreateServer = jest.fn(() => ({
      listen: () => {
        fakeListen();
      } 
    }));
    const net = {
      createServer: jest.fn(() => fakeCreateServer())
    };
    const db = {
      open: jest.fn()
    };
    await server({ net, db })(8080);

    expect(fakeCreateServer).toHaveBeenCalled();
    expect(fakeListen).toHaveBeenCalled();
  });
  
});