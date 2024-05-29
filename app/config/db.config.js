//hosting
module.exports = {
  HOST: "dpg-cpbdm95ds78s73et8flg-a.frankfurt-postgres.render.com",
  USER: "zzmadmin",
  PASSWORD: "nFVYkuwGNBlp3jujFOt68FnCQN60XO0D",
  DB: "defaultdb_ted4",
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