module.exports = deps => {
  const { db } = deps;

  return {
    getEquipament: (context) => {
      let params = [];
      let sql = `select id, serial, veiculoId, isBackup, chipNumero
      from Equipamento
      where 1 = 1`;

      if (context.id !== undefined) {
        sql += `\nand id = ?`;
        params.push(context.id);
      }

      if (context.serial !== undefined) {
        sql += `\nand serial like ?`;
        params.push(context.serial);
      }

      return db.get(sql, params);
    },

    updateChipNumber: (context) => {
      const sql = `update Equipamento set chipNumero = ? where id = ?`;
      db.run(sql, [
        context.chipNumber,
        context.id
      ]);

      return true;
    }
  }
};