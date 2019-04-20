function createAdapter({ socketConnection, services, parser }) {
  return {
    data: async (rawData) => {
      const parsedDataObject = parser.parse(rawData)
      
      const equipmentService = services.equipment
      const positionService = services.position

      // const {
      //   serial,
      //   cmd,
      //   dataValidity,
      //   date,
      //   hour,
      //   lat,
      //   lng,
      //   speed,
      //   course,
      //   status,
      //   signal,
      //   power,
      //   oil,
      //   mileage,
      //   altitude
      // }

      const {
        serial,
        cmd
      } = parsedDataObject

      // TODO: query serial on the database and check if it exists
      const equipmentObject = await equipmentService.get({ serial })

      // if (equipmentObject === null) {
      //   throw new Error('[ADAPTER01] equipamento não encontrado')
      // }

      switch(cmd) {
        case 'RG':
          socketConnection.write('*ET,01234,RG,13691779574#')
          break;
        case 'HB':
          await positionService.save(parsedDataObject)
          break;
        case 'MQ':
          socketConnection.write('*ET,SN,MQ#')
          break;
        default:
          break;
      }
    },

    end: () => {

    }
  }
}

// const socketConnectionMock = {
//   write: () => { console.log('write') }
// }
// const parser = require('./parser')()

// const servicesMock = {
//   equipment: {
//     get: () => new Promise(resolve => {
//       resolve({ id: 1 })
//     })
//   },
//   position: {
//     save: () => new Promise(resolve => { resolve() })
//   }
// }

// const adapter = createAdapter({
//   socketConnection: socketConnectionMock,
//   services: servicesMock,
//   parser
// })

// const gpsDataMock = '*ET,01234,RG,13691779574#'
// adapter.data(gpsDataMock)

describe('adapter01', () => {
  
  it('RG command', () => {
    const socketConnectionMock = {
      write: jest.fn()
    }
    const parser = require('./parser')()

    const servicesMock = {
      equipment: {
        get: jest.fn(() => new Promise(resolve => {
          resolve({ id: 1 })
        }))
      },
      position: {
        save: jest.fn(() => new Promise(resolve => { resolve() }))
      }
    }

    const adapter = createAdapter({
      socketConnection: socketConnectionMock,
      services: servicesMock,
      parser
    })

    const gpsDataMock = '*ET,01234,RG,13691779574#'
    adapter.data(gpsDataMock)
    expect(socketConnectionMock.write).toBeCalled()
  })

  it('HB command', () => {
    const socketConnectionMock = {
      write: jest.fn()
    }
    const parser = require('./parser')()

    const servicesMock = {
      equipment: {
        get: jest.fn(() => new Promise(resolve => {
          resolve({ id: 1 })
        }))
      },
      position: {
        save: jest.fn(() => new Promise(resolve => { resolve() }))
      }
    }

    const adapter = createAdapter({
      socketConnection: socketConnectionMock,
      services: servicesMock,
      parser
    })

    const gpsDataMock = '*ET,01234,HB,A,130208,0c1007,81033017,81e35163,0000,0000,00000000,1c,100,0000,9514,581#'
    adapter.data(gpsDataMock)
    expect(servicesMock.equipment.get).toBeCalled()
    expect(servicesMock.position.save).toBeCalled()
    expect(socketConnectionMock.write).not.toBeCalled()
  })

  it('MQ command', () => {
    const socketConnectionMock = {
      write: jest.fn()
    }
    const parser = require('./parser')()

    const servicesMock = {
      equipment: {
        get: jest.fn(() => new Promise(resolve => {
          resolve({ id: 1 })
        }))
      },
      position: {
        save: jest.fn(() => new Promise(resolve => { resolve() }))
      }
    }

    const adapter = createAdapter({
      socketConnection: socketConnectionMock,
      services: servicesMock,
      parser
    })

    const gpsDataMock = '*ET,01234,MQ#'
    adapter.data(gpsDataMock)
    expect(socketConnectionMock.write).toBeCalled()
  })

})