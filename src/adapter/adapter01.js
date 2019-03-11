module.exports = () => {
  function onData(data) {
    return new Promise((resolve, reject) => {
      const parsedData = _parse(data)

      if (parsedData === false)
        reject('data could not be parsed')
      
      resolve(parsedData)
    })
  }

  function _parse(data) {
    // from here to bellow its just to fake the behavior
    const str = data.toString('utf8');
    const verificationString =  str.substring(0, 2);
    const packageString = str.substring(2, str.length);

    if (verificationString !== '01')
      return false;

    return packageString;
  }

  return {
    onData: onData
  }
}