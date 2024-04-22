module.exports = (sequelize, Sequelize) => {
    const Shelf = sequelize.define("shelves", {
        ID_SHELF: {
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
        ID_GAME: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'games',
                key: 'ID_GAME'
            }
        }
    });


    Shelf.associate = function(models) {
        Shelf.belongsTo(models.User, {
            foreignKey: 'ID_USER',
            as: 'user'
        });
        Shelf.belongsTo(models.Game, {
            foreignKey: 'ID_GAME',
            as: 'game'
        });
    };
    
    return Shelf;
};