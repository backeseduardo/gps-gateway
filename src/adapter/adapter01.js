module.exports = (conn) => {

  function data(data) {
    return new Promise((resolve, reject) => {
      const parsedData = _parse(data)

      if (parsedData === false) {
        conn.write('data package invalid, ending connection\r\n')
        reject('data could not be parsed')
      }

      conn.write(`package received [${parsedData}]\r\n`)
      
      resolve(parsedData)
    })
  }

  function end() {
    return Promise.resolve()
  }

  function _parse(data) {
    // from here to bellow its just to fake the behavior
    const str = data.toString('utf8').replace('\r', '').replace('\n', '');
    const verificationString =  str.substring(0, 2);
    const packageString = str.substring(2, str.length);

    if (verificationString !== '01')
      return false;

    return packageString;
  }

  return {
    data,
    end
  }

}