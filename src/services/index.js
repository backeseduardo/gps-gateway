const db = require('sqlite');

module.exports = ({
  equipment: require('./equipment.factory')(db)
});