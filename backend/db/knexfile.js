// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "responseTime",
      user: "postgres",
      password: "Litalp",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_responses_migrations",
    },
  },
};
