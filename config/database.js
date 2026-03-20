const path = require('path');
const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  // If we are on Render (Production), use PostgreSQL
  if (env('NODE_ENV') === 'production') {
    const config = parse(env('DATABASE_URL'));
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: false, // Required for Render connections
          },
        },
        debug: false,
      },
    };
  }

  // If we are local, keep using SQLite so your local development doesn't break
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};