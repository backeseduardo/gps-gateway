const db = require('sqlite');

module.exports = ({
  equipment: require('./equipment.factory')(db),
  position: require('./position.factory')(db)
});