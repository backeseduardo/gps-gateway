const services = require('../services/index');

module.exports = (conn) => {

  async function data(data) {
    await __parse(data);
    // return new Promise((resolve, reject) => {
    //   const parsedData = __parse(data)

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

  async function __parse(data) {
    // *ET,358155100181438,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#
    const str = data.toString('ascii').replace('\r', '').replace('\n', '');

    // check if the package is valid
    if (str.indexOf('*') === -1
      || str.indexOf('#') === -1
      || str.indexOf('#') <= str.indexOf('*'))
    {
      throw new Error(`[ADAPTER01] pacote de dados inválido`);
    }

    console.log(`[ADAPTER01] ${str}`);

    const packageArray = str.replace('*', '').replace('#', '').split(',');
    const serial = packageArray[1];
    const cmd = packageArray[2];

    const device = await services.equipment.getEquipament({
      serial: serial
    });

    if (!device) {
      throw new Error(`[ADAPTER01] serial ${serial} não cadastrado no sistema`);
    }

    let gpsData = null;

    switch (cmd) {
      case 'RG': // device -> server: register device on platform
        // *ET,SN,RG,M_SIM#
        // *ET,135790246811221,RG,13691779574#
        const chipNumber = packageArray[3];
        services.equipment.updateChipNumber({
          id: device.id,
          chipNumber: chipNumber
        });
        const equipment = await services.equipment.getEquipament({
          id: device.id
        });
        
        if (chipNumber === equipment.chipNumero) {
          console.log(`[ADAPTER01] RG ${packageArray}`);
        } else {
          throw new Error(`[ADAPTER01] ERROR RG ${packageArray}`);
        }
        break;
      
      case 'HB': // device -> server: heartbeat data, vehicle stopped (10 in 10 minutes), vehicle driving (20 in 20 secs)
        // *ET,SN,HB,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC, altitude ,tolerance#
        // *ET,135790246811221,HB,A,050915,0C2A27,00CE5954,04132263,0000,F000,01000000,20,4,0000,00F123,100,200#
        // *ET,358155100181438,HB,A,130208,061a21,81033017,81e35163,0000,0000,00000000,20,100,0000,9514,581#
        gpsData = __extractData(packageArray);
        await __saveData(gpsData);
        break;
      
      case 'AM': // device -> server: alarm message
        // *ET,SN,AM,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC#
        /*The data is sent from terminal to server, to report alarm to server.
          The cause of alarm depends on the status string in GPRS protocol data.*/
        gpsData = __extractData(packageArray);
        break;

      case 'UP': // device -> server: make sure the device is communicating with the server.
        // *ET,SN,UP#
        // *ET,135790246811221,UP#
        /*The command to require server reply, in order to make sure the device is communicating
          with server. It is sent each 5 minutes, and server need to reply in time, otherwise device will
          keep sending UP each 30 seconds. If server still not reply device after device sending 9 UP
          data, device will restart.*/
        gpsData = __extractData(packageArray);
        break;

      case 'DW': // device -> server: get position information
        // *ET,SN,DW,A/V,YYMMDD,HHMMSS,Latitude,Longitude,Speed,Course,Status,Signal,Power,oil,LC#
        // *ET,135790246811221,DW,A,050915,0C2A27,00CE5954,04132263,0000,F000,01000000,20,4,0000,001254#
        // server need to respond to device
        // *ET,SN,DW,msg #
        /*Msg: msg is Unicode character string
          Note: This msg is the message of detail address, which is the longitude and latitude get from device, then uploads to
          server and gets the detail address from server.*/
        gpsData = __extractData(packageArray);
        break;

      case 'TX': // device -> server:
        // *ET,SN,TX,V,YYMMDD,HHMMSS#
        /*if HB interval is set too long, the device will lost contact with server. Therefore TX is used here to keep
          contact with server. TX data is sent each 3 minutes, the server should reply it. If the server does not reply,
          the device will send this data each 30 seconds.*/
        gpsData = __extractData(packageArray);
        break;

      case 'MQ': // device -> server: upload data which is stored while no GSM
        /*When device uploads stored data to server, it will send this command first. If server not replies, means data cannot
          be uploaded. If server replied, device will upload data
          Format sent from device：
          *ET,SN,MQ#
          Server reply:
          *ET,SN,MQ#*/
        conn.write(`*ET,${serial},MQ#`);
        break;
    
      default:
        throw new Error(`[ADAPTER01] command ${cmd} not found`);
        break;
    }

    // console.log(gpsData);
  }

  async function __saveData(data) {
    const equipment = await services.equipment.getEquipament({
      serial: data.serial
    });

    if (!equipment) {
      throw new Error(`[ADAPTER01] ERROR HB serial ${data.serial} not found`);
    }

    await services.position.save({
      equipamentoId: equipment.id,
      veiculoId: equipment.veiculoId,
      data: `${data.date} ${data.hour}`,
      lat: data.lat,
      lng: data.lng,
      velocidade: data.speed,
      angulo: data.course,
      odometro: data.mileage
    });
  }

  function __extractData(packageArray) {
    return {
      serial: packageArray[1],
      cmd: packageArray[2],
      dataValidity: packageArray[3], // A means GPS data is available, V means data is unavailable, L means base station data
      date: __convertDate(packageArray[4]),
      hour: __convertHour(packageArray[5]),
      lat: __convertLat(packageArray[6] || null),
      lng: __convertLng(packageArray[7] || null),
      speed: __convertSpeed(packageArray[8] || null),
      course: __convertCourse(packageArray[9] || null), // azimoth angle, noth for 0 degree
      status: packageArray[10] || null,
      signal: __convertSignal(packageArray[11] || null),
      power: packageArray[12] || null,
      oil: packageArray[13] || null,
      mileage: __convertMileage(packageArray[14] || null),
      altitude: packageArray[15] || null
    };
  }

  function __convertDate(dateHex) {
    if (dateHex === null)
      return null;
    
    let year = parseInt(dateHex.substr(0, 2), 16) + 2000;
    year = year.toString();

    let month = parseInt(dateHex.substr(2, 2), 16).toString();
    month = month.length === 1 ? '0'+month : month;

    let day = parseInt(dateHex.substr(4, 2), 16).toString();
    day = day.length === 1 ? '0'+day : day;

    return `${year}-${month}-${day}`;
  }

  function __convertHour(hourHex) {
    if (hourHex === null)
      return null;

    let hour = parseInt(hourHex.substr(0, 2), 16).toString();
    hour = hour.length === 1 ? '0'+hour : hour;

    let minute = parseInt(hourHex.substr(2, 2), 16).toString();
    minute = minute.length === 1 ? '0'+minute : minute;

    let second = parseInt(hourHex.substr(4, 2), 16).toString();
    second = second.length === 1 ? '0'+second : second;

    return `${hour}:${minute}:${second}`;
  }

  function __convertLat(latHex) {
    if (latHex === null)
      return null;

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

  function __convertLng(lngHex) {
    if (lngHex === null)
      return null;

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

  function __convertSpeed(speedHex) {
    if (speedHex === null)
      return null;

    return parseInt(speedHex, 16) / 100;
  }

  function __convertCourse(courseHex) {
    if (courseHex === null)
      return null;

    return parseInt(courseHex, 16) / 100;
  }

  // converts signal intensity to percentage
  function __convertSignal(signal) {
    if (signal === null)
      return null;

    // signal intensity, from 0-32
    return parseInt(signal) * 100 / 32;
  }

  function __convertMileage(mileageHex) {
    if (mileageHex === null)
      return null;

    return parseInt(mileageHex, 16) / 10;
  }

  return {
    data,
    end
  }

}