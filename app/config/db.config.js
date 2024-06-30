//hosting
module.exports = {
  HOST: "dpg-cq0jar6ehbks73eccaig-a.frankfurt-postgres.render.com",
  USER: "zzmadmin",
  PASSWORD: "bVWfy7e95Gf0aLRImyD8qBOfEZI2kkVU",
  DB: "defaultdb_kifg",
  port: 5432,
  dialect: "postgres",
  ssl: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    }
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