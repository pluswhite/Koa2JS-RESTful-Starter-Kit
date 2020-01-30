/**
 * Default config
 */
// console.log(process.env);
module.exports = {
  port: 3000,
  secret: process.env.APP_SECRET,
  database: {
    dbname: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
