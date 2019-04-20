module.exports = deps => {
  const { db } = deps;

  return {
    get: () => {
      const sql = `select *
      from Posicao
      order by id desc`;

      return db.all(sql);
    },

    save: (context) => {
      // const sql = `insert into Posicao 
      //   (equipamentoId, veiculoId, data, lat, lng, velocidade, angulo, odometro)
      // values 
      //   (?, ?, ?, ?, ?, ?, ?, ?)`;

      // const params = [
      //   context.equipamentoId,
      //   context.veiculoId,
      //   context.data,
      //   context.lat,
      //   context.lng,
      //   context.velocidade,
      //   context.angulo,
      //   context.odometro
      // ];

      // return db.run(sql, params);

      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      })
    }
  }
};