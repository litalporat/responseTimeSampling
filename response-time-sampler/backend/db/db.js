const knex = require("knex");
const kenxfile = require("./knexfile");

const db = knex(kenxfile.development);

module.exports = db;
