module.exports = (sequelize, Sequelize) => {
    const GameRequests = sequelize.define("gameRequests", {
        ID_REQUEST: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_USER: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID_USER'
            }
        },
        GameName: {
            type: Sequelize.STRING
        },
        Description: {
            type: Sequelize.TEXT
        }
    },{
        timestamps: false,
        freezeTableName: true
    });


    GameRequests.associate = function(models) {
        GameRequests.belongsTo(models.User, {
            foreignKey: 'ID_USER',
            as: 'user'
        });
    };
    
    return GameRequests;
};