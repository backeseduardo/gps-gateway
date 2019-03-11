module.exports = (deps) => {
  const { adapter, conn } = deps

  return {
  
    data: data => adapter(conn).data(data),

    end: () => adapter(conn).end()

  }
}