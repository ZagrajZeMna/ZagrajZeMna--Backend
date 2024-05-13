const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    port: config.port,
    dialect: config.dialect,
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

db.User = require('./user.model.js')(sequelize, Sequelize);
db.Game = require('./game.model.js')(sequelize, Sequelize);
db.Languages = require('./languages.model.js')(sequelize, Sequelize);
db.Lobby = require('./lobby.model.js')(sequelize, Sequelize);
db.UserInLobby = require('./userInLobby.model.js')(sequelize, Sequelize);
db.Message = require('./message.model.js')(sequelize, Sequelize);
db.GameRequests = require('./gameRequests.model.js')(sequelize, Sequelize);
db.Shelf = require('./shelf.model.js')(sequelize, Sequelize);
db.UserReview = require('./userReviews.model.js')(sequelize, Sequelize);
db.DayLobby = require('./dayLobby.model.js')(sequelize, Sequelize);
db.Day = require('./day.model.js')(sequelize, Sequelize);



Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});


module.exports = db;