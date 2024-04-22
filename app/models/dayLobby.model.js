module.exports = (sequelize, Sequelize) => {
    const DayLobby = sequelize.define("dayLobbies", {
        ID_DAY: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            
        },
        ID_LOBBY: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            
        },
        TimeInThisDay: {
            type: Sequelize.TIME,
        }
    });

    DayLobby.associate = function(models){
        DayLobby.hasMany(models.Day, {
            foreignKey: 'ID_DAY',
            as: 'day'
        });
        DayLobby.belongsTo(models.Lobby, {
            foreignKey: 'ID_LOBBY',
            as: 'lobby'
        });
    };

    return DayLobby;
};