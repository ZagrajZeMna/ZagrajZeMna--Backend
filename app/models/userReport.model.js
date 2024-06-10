module.exports = (sequelize, Sequelize) => {
    const UserReport = sequelize.define("userReport", {
        ID_REPORT: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_REPORTING: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users', 
                key: 'ID_USER'
            }
        },
        ID_REPORTED: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users', 
                key: 'ID_USER'
            }
        },
        Description: {
            type: Sequelize.TEXT
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });



    UserReport.associate = function(models) {
        UserReport.belongsTo(models.User, {
            foreignKey: 'ID_REPORTING',
            as: 'reporting'
        });
    
        UserReport.belongsTo(models.User, {
            foreignKey: 'ID_REPORTED',
            as: 'reported'
        });
    };


    
    return UserReport;
};