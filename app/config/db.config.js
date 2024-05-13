//hosting
module.exports = {
  HOST: "pg-zagrajzemna-123.c.aivencloud.com",
  USER: "avnadmin",
  PASSWORD: "AVNS_xC2JvrBRqM3258Y3kq2",
  DB: "defaultdb",
  port: 28985,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
// //docker setup
// module.exports = {
//   HOST: "db",
//   USER: "postgres",
//   PASSWORD: "postgres",
//   DB: "postgres_db",
//   port: 5432,
//   dialect: "postgres",
//   pool: {
//     max: 100,
//     min: 0,
//     acquire: 10000,
//     idle: 20000
//   },
//   logging: false
// };


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