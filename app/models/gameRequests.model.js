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
        gameTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gameDescription: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        requestDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    });

    return GameRequests;
};
