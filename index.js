const args = require('minimist')(process.argv.slice(2));

console.log(args.port);
console.log(args.adapter);
