const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importowanie modeli
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.language = require("../models/language.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);

// Definiowanie relacji
db.language.hasMany(db.user, { as: "users", foreignKey: "ID_LANGUAGE" });
db.user.belongsTo(db.language, {
  foreignKey: "ID_LANGUAGE",
  as: "language"
});

module.exports = db;
