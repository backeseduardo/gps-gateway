
describe('server.test.js', () => {

  it('expect server to be initialized properly', () => {
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
    server({ net })(8080);

    expect(fakeCreateServer).toHaveBeenCalled();
    expect(fakeListen).toHaveBeenCalled();
  });
  
});