module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("games", {
      name: {
        type: Sequelize.STRING
      },
      image:{
        type: Sequelize.STRING
      }

    }, {
      timestamps: false
    });
  
    return Game;
  };
  