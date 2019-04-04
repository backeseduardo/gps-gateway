module.exports = deps => {
  const { db } = deps;

  return {
    getEquipament: (context) => {
      let params = [];
      let sql = `select id, serial, veiculoId, isBackup
      from Equipamento
      where 1 = 1`;

      if (context.serial !== null) {
        sql += `\nand serial like ?`;
        params.push(context.serial);
      }

      return db.get(sql, params);
    }
  }
};