module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("games", {
        ID_GAME: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
        },
        image: {
            type: Sequelize.STRING,
        }
    },
    {
        timestamps: false
    });

    Game.associate = function(models) {
        Game.hasMany(models.Shelf, {
            foreignKey: 'ID_GAME',
            as: 'shelves'
        });
        Game.hasMany(models.Lobby, {
            foreignKey: 'ID_GAME',
            as: 'lobbies'
        });
    };


    
    return Game;
};