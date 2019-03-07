
describe('server.test.js', () => {

  it('expect server to be initialized properly', () => {
    const serverFactory = require('./server.factory');
    const fakeListen = jest.fn();
    const fakeCreateServer = jest.fn(() => ({
      listen: () => {
        fakeListen();
      } 
    }));
    const net = {
      createServer: jest.fn(() => fakeCreateServer())
    };
    const server = serverFactory({ net });
    server(8080);

    expect(fakeCreateServer).toHaveBeenCalled();
    expect(fakeListen).toHaveBeenCalled();
  });
  
});