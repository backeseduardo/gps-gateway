const services = require('../services/index');

module.exports = (conn) => {

  async function data(data) {
    await _parse(data);
    // return new Promise((resolve, reject) => {
    //   const parsedData = _parse(data)

    //   if (parsedData === false) {
    //     conn.write('data package invalid, ending connection\r\n')
    //     reject('data could not be parsed')
    //   }

    //   conn.write(`package received [${parsedData}]\r\n`)
      
    //   resolve(parsedData)
    // })
  }

  function end() {
    return Promise.resolve()
  }

  async function _parse(data) {
    // *ET,358155100181438,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#
    const str = data.toString('ascii').replace('\r', '').replace('\n', '');

    // check if the package is valid
    if (str.indexOf('*') === -1
      || str.indexOf('#') === -1
      || str.indexOf('#') <= str.indexOf('*'))
    {
      throw new Error(`[ADAPTER01] pacote de dados inválido`);
    }

    const packageArray = str.replace('*', '').replace('#', '').split(',');
    const serial = packageArray[1];
    const cmd = packageArray[2];

    const result = await services.equipment.getEquipament({
      serial: serial
    });

    if (!result) {
      throw new Error(`[ADAPTER01] serial ${serial} não cadastrado no sistema`);
    }

    console.log(result);

    switch (cmd) {
      case 'RG': // device -> server: register device on platform
        // *ET,SN,RG,M_SIM#
        // *ET,135790246811221,RG,13691779574#
        break;
      
      case 'HB': // device -> server: heartbeat data, vehicle stopped (10 in 10 minutes), vehicle driving (20 in 20 secs)
        // *ET,SN,HB,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC, altitude ,tolerance#
        // *ET,135790246811221,HB,A,050915,0C2A27,00CE5954,04132263,0000,F000,01000000,20,4,0000,00F123,100,200#
        // *ET,358155100181438,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#
        _extractData(packageArray);
        break;
      
      case 'AM': // device -> server: alarm message
        // *ET,SN,AM,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC#
        /*The data is sent from terminal to server, to report alarm to server.
          The cause of alarm depends on the status string in GPRS protocol data.*/
        break;
    
      default:
        throw new Error('[ADAPTER01] command not found');
        break;
    }
  }

  function _extractData(packageArray) {
    const receivedData = {
      serial: packageArray[1],
      cmd: packageArray[2],
      dataValidity: packageArray[3], // A means GPS data is available, V means data is unavailable, L means base station data
      date: packageArray[4],
      hour: packageArray[5],
      lat: _convertLat(packageArray[6]),
      lng: _convertLng(packageArray[7]),
      speed: packageArray[8],
      course: packageArray[9], // azimoth angle, noth for 0 degree
      status: packageArray[10],
      signal: packageArray[11],
      power: packageArray[12],
      oil: packageArray[13],
      mileage: packageArray[14],
      altitude: packageArray[15],
      tolerance: packageArray[16]
    };
  }

  function _convertDate(dateHex) {
    
  }

  function _convertLat(latHex) {
    let northSouthFactor = 1;
    // first char is 8, it means it is a south latitude
    // the first char should be removed
    if (latHex.charAt(0) === '8') {
      latHex = latHex.slice(1);
      northSouthFactor = -1;
    }

    // convert hexadecimal to decimal
    let latitude = parseInt(latHex, 16);
    // divide by 600000
    latitude = latitude / 600000;
    // multiply by northSouthFactor, if factor is -1 then it is south latitude, if 1 north
    latitude *= northSouthFactor;

    return latitude;
  }

  function _convertLng(lngHex) {
    let westEastFactor = 1;
    // first char is 8, it means it is a south latitude
    // the first char should be removed
    if (lngHex.charAt(0) === '8') {
      lngHex = lngHex.slice(1);
      westEastFactor = -1;
    }

    // convert hexadecimal to decimal
    let latitude = parseInt(lngHex, 16);
    // divide by 600000
    latitude = latitude / 600000;
    // multiply by westEastFactor, if factor is -1 then it is south latitude, if 1 north
    latitude *= westEastFactor;

    return latitude;
  }

  return {
    data,
    end
  }

}