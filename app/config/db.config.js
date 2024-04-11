//docker setup
module.exports = {
  HOST: "db",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "postgres_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


// // local computer
// module.exports = {
//   HOST: "localhost",
//   USER: "postgres",
//   PASSWORD: "123",
//   DB: "testdb",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };