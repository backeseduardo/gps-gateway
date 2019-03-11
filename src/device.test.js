
describe('device.test.js', () => {

  let device = null
  let adapter = conn => ({
    data: data => Promise.resolve(data),
    end: () => Promise.resolve()
  })
  beforeEach(() => {
    device = require('./device')({ adapter, conn: jest.fn() })
  });

  it('expect data return data', () => {
    return device.data('01test')
    .then(result => {
      expect(result).toBe('01test')
    })
  })

  it('expect end to return a promise', () => {
    return device.end()
    .then(result => {
      expect(true).toBe(true)
    })
  })

})