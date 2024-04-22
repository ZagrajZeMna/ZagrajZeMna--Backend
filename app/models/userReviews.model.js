module.exports = (sequelize, Sequelize) => {
    const UserReview = sequelize.define("userReviews", {
        ID_REVIEW: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_REVIEWER: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users', 
                key: 'ID_USER'
            }
        },
        ID_ABOUT: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users', 
                key: 'ID_USER'
            }
        },
        stars: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.TEXT
        },
        date: {
            type: Sequelize.DATE
        },
        time: {
            type: Sequelize.TIME
        }
    }, {
        timestamps: false
    });



    UserReview.associate = function(models) {
        UserReview.belongsTo(models.User, {
            foreignKey: 'ID_REVIEWER',
            as: 'reviewer'
        });
    
        UserReview.belongsTo(models.User, {
            foreignKey: 'ID_ABOUT',
            as: 'aboutUser'
        });
    };


    
    return UserReview;
};