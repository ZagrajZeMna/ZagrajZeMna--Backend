module.exports = (sequelize, Sequelize) => {
    const Languages = sequelize.define("languages", {
        ID_LANGUAGE: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        LANGUAGE: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    });


    Languages.associate = function(models) {
        Languages.hasMany(models.Lobby, {
            foreignKey: 'ID_LANGUAGE',
            as: 'lobbies'
        });
        Languages.hasMany(models.User, {
            foreignKey: 'ID_LANGUAGE',
            as: 'users'
        });
    }
    
    return Languages;
};