module.exports = (deps) => {
  const { adapter } = deps

  return (conn) => ({
  
    onData: data => adapter.onData(data),

    end: () => new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    })

  })
}