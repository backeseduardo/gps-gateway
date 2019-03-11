
describe('device.test.js', () => {

  let device = null;
  let adapter = require('./adapter/adapter01')()
  beforeEach(() => {
    device = require('./device')({ adapter })();
  });

  it('expect onData return parsed data', () => {
    return device.onData('01test')
    .then(result => {
      expect(result).toBe('test');
    });
  });

  it('expect onData to reject parse data', () => {
    return device.onData('test')
    .catch(err => {
      expect(err).toBeTruthy();
    });
  });

  it('expect end to return a promise', () => {
    return device.end()
    .then(result => {
      expect(true).toBe(true);
    });
  });

});