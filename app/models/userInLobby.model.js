module.exports = (sequelize, Sequelize) => {
    const UserInLobby = sequelize.define("UserInLobby", {
        ID_UIL: {
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
            allowNull: false
        },
        Accepted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        Description: {
            type: Sequelize.TEXT
        }
    },{
        timestamps: false,
        freezeTableName: true
    });

    UserInLobby.associate = function(models) {
        UserInLobby.belongsTo(models.User, {
            foreignKey: 'ID_USER',
            as: 'user'
        });
        UserInLobby.belongsTo(models.Lobby, {
            foreignKey: 'ID_LOBBY',
            as: 'lobby'
        });
    };

    return UserInLobby;
};