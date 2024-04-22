module.exports = (sequelize, Sequelize) => {
    const Day = sequelize.define("day", {
        ID_DAY: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        DayName: {
            type: Sequelize.STRING,
        }
    });

    Day.associate = function(models){
        Day.belongsTo(models.DayLobby, {
            foreignKey: 'ID_DAY',
            as: 'daylobby'
        });
    };

    return Day;
};