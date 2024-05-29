module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
        ID_NOTI: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_HOST: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID_USER'
            }
        },
        ID_USER:{
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'ID_USER'
            }
        },
        ID_LOBBY:{
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'lobbies',
                key: 'ID_LOBBY'
            }
        },
        status:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        type:{
            type: Sequelize.STRING,
            allowNull: true,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    },{
        timestamps: false,
        freezeTableName: true
    });


    Notification.associate = function(models) {
        Notification.belongsTo(models.User, {
            foreignKey: 'ID_USER',
            as: 'user'
        });
        Notification.belongsTo(models.Lobby, {
            foreignKey: 'ID_USER',
            as: 'lobby'
        });
    };
    
    return Notification;
};