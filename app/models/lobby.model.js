
module.exports = (sequelize, Sequelize) => {
    const Lobby = sequelize.define("lobbies", {
        ID_LOBBY: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_OWNER: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID_USER'
            }
        },
        ID_GAME: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'games',
                key: 'ID_GAME'
            }
        },
        Name: {
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.TEXT
        },
        ID_LANGUAGE: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'languages',
                key: 'ID_LANGUAGE'
            }
        },
        City: {
            type: Sequelize.STRING
        },
        NeedUsers: {
            type: Sequelize.INTEGER
        },
        Active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        StillLooking: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        PlayingFrequency: {
            type: Sequelize.INTEGER,
        },
        IsFirstGame: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });


    Lobby.associate = function(models) {
        Lobby.belongsTo(models.User, {
            foreignKey: 'ID_OWNER',
            as: 'owner'
        });
        Lobby.belongsTo(models.Game, {
            foreignKey: 'ID_GAME',
            as: 'game'
        });
        Lobby.belongsTo(models.Languages, {
            foreignKey: 'ID_LANGUAGE',
            as: 'language'
        });
        Lobby.hasMany(models.UserInLobby, {
            foreignKey: 'ID_LOBBY',
            as: 'users'
        });
        Lobby.hasMany(models.Message, {
            foreignKey: 'ID_LOBBY',
            as: 'messages'
        });
        Lobby.hasMany(models.DayLobby, {
            foreignKey: 'ID_LOBBY',
            as: 'daylobby'
        })
    };

    
    return Lobby;
};