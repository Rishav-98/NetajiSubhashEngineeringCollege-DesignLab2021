module.exports = {
  HOST: "localhost",
  USER: "jwtdb",
  PASSWORD: "jwtdb",
  DB: "jwtdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
