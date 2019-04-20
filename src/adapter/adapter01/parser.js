const converter = require('./converter');

function parser() {
  return {
    parse: rawData => {
      if (rawData.indexOf('*') === -1
        || rawData.indexOf('#') === -1
        || rawData.indexOf('#') <= rawData.indexOf('*'))
      {
        throw new Error(`[ADAPTER01] pacote de dados inválido`);
      }

      arrayData = rawData.replace('*', '').replace('#', '').split(',')

      const cmd = arrayData[2]

      switch (cmd) {
        case 'RG':
          return RG(arrayData)
        case 'HB':
          return HB(arrayData)
        case 'AM':
          return AM(arrayData)
        case 'UP':
          return UP(arrayData)
        case 'DW':
          return DW(arrayData)
        case 'TX':
          return TX(arrayData)
        case 'MQ':
          return MQ(arrayData)
        default:
          throw new Error(`[ADAPTER01] command ${cmd} not found`)
      }
    }
  }
}

function RG(arrayData) {
   // device -> server: register device on platform
  // *ET,SN,RG,M_SIM#
  // *ET,135790246811221,RG,13691779574#
  return {
    serial: arrayData[1],
    cmd: arrayData[2],
    chipNumber: arrayData[3]
  }
}

function HB(arrayData) {
  // device -> server: heartbeat data, vehicle stopped (10 in 10 minutes), vehicle driving (20 in 20 secs)
  // *ET,SN,HB,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC, altitude ,tolerance#
  // *ET,135790246811221,HB,A,050915,0C2A27,00CE5954,04132263,0000,F000,01000000,20,4,0000,00F123,100,200#
  // *ET,358155100181438,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#
  return {
    serial: arrayData[1],
    cmd: arrayData[2],
    dataValidity: arrayData[3], // A means GPS data is available, V means data is unavailable, L means base station data
    date: converter.convertDate(arrayData[4]),
    hour: converter.convertHour(arrayData[5]),
    lat: converter.convertLat(arrayData[6] || null),
    lng: converter.convertLng(arrayData[7] || null),
    speed: converter.convertSpeed(arrayData[8] || null),
    course: converter.convertCourse(arrayData[9] || null), // azimoth angle, noth for 0 degree
    status: arrayData[10] || null,
    signal: converter.convertSignal(arrayData[11] || null),
    power: parseInt(arrayData[12]) || null,
    oil: arrayData[13] || null,
    mileage: converter.convertMileage(arrayData[14] || null),
    altitude: parseInt(arrayData[15]) || null
  }
}

function AM(arrayData) {
  // device -> server: alarm message
  // *ET,SN,AM,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC#
  /*The data is sent from terminal to server, to report alarm to server.
    The cause of alarm depends on the status string in GPRS protocol data.*/
  return {
    serial: arrayData[1],
    cmd: arrayData[2],
    dataValidity: arrayData[3], // A means GPS data is available, V means data is unavailable, L means base station data
    date: converter.convertDate(arrayData[4]),
    hour: converter.convertHour(arrayData[5]),
    lat: converter.convertLat(arrayData[6] || null),
    lng: converter.convertLng(arrayData[7] || null),
    speed: converter.convertSpeed(arrayData[8] || null),
    course: converter.convertCourse(arrayData[9] || null), // azimoth angle, noth for 0 degree
    status: arrayData[10] || null,
    signal: converter.convertSignal(arrayData[11] || null),
    power: parseInt(arrayData[12]) || null,
    oil: arrayData[13] || null,
    mileage: converter.convertMileage(arrayData[14] || null)
  }
}

function UP(arrayData) {
  // device -> server: make sure the device is communicating with the server.
  // *ET,SN,UP#
  // *ET,135790246811221,UP#
  /*The command to require server reply, in order to make sure the device is communicating
    with server. It is sent each 5 minutes, and server need to reply in time, otherwise device will
    keep sending UP each 30 seconds. If server still not reply device after device sending 9 UP
    data, device will restart.*/
  return {
    serial: arrayData[1],
    cmd: arrayData[2]
  }
}

function DW(arrayData) {
  // device -> server: get position information
  // *ET,SN,DW,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC#
  // *ET,135790246811221,DW,A,050915,0C2A27,00CE5954,04132263,0000,F000,01000000,20,4,0000,001254#
  // server need to respond to device
  // *ET,SN,DW,msg #
  /*Msg: msg is Unicode character string
    Note: This msg is the message of detail address, which is the longitude and latitude get from device, then uploads to
    server and gets the detail address from server.*/
  return {
    serial: arrayData[1],
    cmd: arrayData[2],
    dataValidity: arrayData[3], // A means GPS data is available, V means data is unavailable, L means base station data
    date: converter.convertDate(arrayData[4]),
    hour: converter.convertHour(arrayData[5]),
    lat: converter.convertLat(arrayData[6] || null),
    lng: converter.convertLng(arrayData[7] || null),
    speed: converter.convertSpeed(arrayData[8] || null),
    course: converter.convertCourse(arrayData[9] || null), // azimoth angle, noth for 0 degree
    status: arrayData[10] || null,
    signal: converter.convertSignal(arrayData[11] || null),
    power: parseInt(arrayData[12]) || null,
    oil: arrayData[13] || null,
    mileage: converter.convertMileage(arrayData[14] || null)
  }
}

function TX(arrayData) {
  // device -> server:
  // *ET,SN,TX,V,YYMMDD,HHMMSS#
  /*if HB interval is set too long, the device will lost contact with server. Therefore TX is used here to keep
    contact with server. TX data is sent each 3 minutes, the server should reply it. If the server does not reply,
    the device will send this data each 30 seconds.*/
  /*E.g.:
    Device sends: *ET,135790246811221,TX,V,0c0101,011002#
    Server replies: *ET,135790246811221,TX,V,0c0101,011002#*/
  return {
    serial: arrayData[1],
    cmd: arrayData[2],
    dataValidity: arrayData[3], // A means GPS data is available, V means data is unavailable, L means base station data
    date: converter.convertDate(arrayData[4]),
    hour: converter.convertHour(arrayData[5])
  }
}

function MQ(arrayData) {
  // device -> server: upload data which is stored while no GSM
  /*When device uploads stored data to server, it will send this command first. If server not replies, means data cannot
    be uploaded. If server replied, device will upload data
    Format sent from device：
    *ET,SN,MQ#
    Server reply:
    *ET,SN,MQ#*/
  return {
    serial: arrayData[1],
    cmd: arrayData[2]
  }
}

module.exports = parser