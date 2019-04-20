describe('adapter01 parser', () => {
  
  const parser = require('./parser.factory')()
  
  it('happy path', () => {
    const gpsDataMock = '*ET,01234,HB,A,130208,0c1007,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#'
    const result = parser.parse(gpsDataMock)

    expect(result.serial).toBe('01234')
    expect(result.cmd).toBe('HB')
    expect(result.dataValidity).toBe('A')
    expect(result.date).toBe('2019-02-08')
    expect(result.hour).toBe('12:16:07')
    expect(result.lat).toBe(-28.310225)
    expect(result.lng).toBe(-52.791205)
    expect(result.speed).toBe(0)
    expect(result.course).toBe(0)
    expect(result.status).toBe('00000000')
    expect(result.signal).toBe(3.125)
    expect(result.power).toBe(100)
    expect(result.oil).toBe('0000')
    expect(result.mileage).toBe(3816.4)
    expect(result.altitude).toBe(581)
  })

  it('invalid data package', () => {
    const gpsDataMock = 'ET,01234,HB,A,130208,0c1007,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#'
    expect(() => {
      parser.parse(gpsDataMock)
    }).toThrowError('[ADAPTER01] pacote de dados inválido')
  })
})