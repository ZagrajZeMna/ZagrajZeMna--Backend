module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        ID_MESSAGE: {
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
        ID_LOBBY: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'lobbies',
                key: 'ID_LOBBY'
            }
        },
        Message: {
            type: Sequelize.TEXT
        },
        Date: {
            type: Sequelize.DATEONLY
        },
        Time: {
            type: Sequelize.TIME
        }
    },{
        timestamps: false,
        freezeTableName: true
    });


    Message.associate = function(models) {
        Message.belongsTo(models.User, {
            foreignKey: 'ID_USER',
            as: 'user'
        });
        Message.belongsTo(models.Lobby, {
            foreignKey: 'ID_LOBBY',
            as: 'lobby'
        });
    };
    
    return Message;
};