module.exports = {
  convertDate: (dateHex) => {
    if (dateHex === null)
      return null
    
    let year = parseInt(dateHex.substr(0, 2), 16) + 2000
    year = year.toString()
  
    let month = parseInt(dateHex.substr(2, 2), 16).toString()
    month = month.length === 1 ? '0'+month : month
  
    let day = parseInt(dateHex.substr(4, 2), 16).toString()
    day = day.length === 1 ? '0'+day : day
  
    return `${year}-${month}-${day}`
  },
  
  convertHour: (hourHex) => {
    if (hourHex === null)
      return null
  
    let hour = parseInt(hourHex.substr(0, 2), 16).toString()
    hour = hour.length === 1 ? '0'+hour : hour
  
    let minute = parseInt(hourHex.substr(2, 2), 16).toString()
    minute = minute.length === 1 ? '0'+minute : minute
  
    let second = parseInt(hourHex.substr(4, 2), 16).toString()
    second = second.length === 1 ? '0'+second : second
  
    return `${hour}:${minute}:${second}`
  },
  
  convertLat: (latHex) => {
    if (latHex === null)
      return null
  
    let northSouthFactor = 1
    // first char is 8, it means it is a south latitude
    // the first char should be removed
    if (latHex.charAt(0) === '8') {
      latHex = latHex.slice(1)
      northSouthFactor = -1
    }
  
    // convert hexadecimal to decimal
    let latitude = parseInt(latHex, 16)
    // divide by 600000
    latitude = latitude / 600000
    // multiply by northSouthFactor, if factor is -1 then it is south latitude, if 1 north
    latitude *= northSouthFactor
  
    return latitude
  },
  
  convertLng: (lngHex) => {
    if (lngHex === null)
      return null
  
    let westEastFactor = 1
    // first char is 8, it means it is a south latitude
    // the first char should be removed
    if (lngHex.charAt(0) === '8') {
      lngHex = lngHex.slice(1)
      westEastFactor = -1
    }
  
    // convert hexadecimal to decimal
    let latitude = parseInt(lngHex, 16)
    // divide by 600000
    latitude = latitude / 600000
    // multiply by westEastFactor, if factor is -1 then it is south latitude, if 1 north
    latitude *= westEastFactor
  
    return latitude
  },
  
  convertSpeed: (speedHex) => {
    if (speedHex === null)
      return null
  
    return parseInt(speedHex, 16) / 100
  },
  
  convertCourse: (courseHex) => {
    if (courseHex === null)
      return null
  
    return parseInt(courseHex, 16) / 100
  },
  
  // converts signal intensity to percentage
  convertSignal: (signal) => {
    if (signal === null)
      return null
  
    // signal intensity, from 0-32
    return parseInt(signal) * 100 / 32
  },
  
  convertMileage: (mileageHex) => {
    if (mileageHex === null)
      return null
  
    return parseInt(mileageHex, 16) / 10
  }
}