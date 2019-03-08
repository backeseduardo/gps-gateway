module.exports = (deps) => (conn) => ({
  
  onData(data) {
    return new Promise((resolve, reject) => {
      const parsedData = this._parse(data);

      if (parsedData === false)
        reject('data could not be parsed');
      
      setTimeout(() => {
        console.log(parsedData);
        resolve();
      }, 2000);
    });
  },

  end() {
    return new Promise((resolve, reject) => {
      console.log('ending device');
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  },

  _parse(data) {
    // call adapter here to parse the data (adapter.parse)

    // from here to bellow its just to fake the behavior
    const str = data.toString('utf8');
    const verificationString =  str.substring(0, 2);
    const packageString = str.substring(2, str.length - 1);

    if (verificationString !== '01')
      return false;
    
    return packageString;
  }

});