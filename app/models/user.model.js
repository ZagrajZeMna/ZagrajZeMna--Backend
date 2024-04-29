module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
    ID_USER: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,

    },
    password: {
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
    },
    about: {
        type: Sequelize.TEXT
    },
    avatar: {
        type: Sequelize.STRING
    },
    country: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    contact: {
        type: Sequelize.STRING
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isBanned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'Created'
    },
    confirmationCode: {
        type: Sequelize.STRING,
        unique: true
    },
    ID_LANGUAGE: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'languages',
            key: 'ID_LANGUAGE'
        }
    }
    },
    {
    timestamps: false,
    freezeTableName: true
    });


    User.associate = function(models) {
        User.hasMany(models.Shelf, {
            foreignKey: 'ID_USER',
            as: 'shelves'
        });
        User.hasMany(models.UserInLobby, {
            foreignKey: 'ID_USER',
            as: 'userInLobbies'
        });
        User.hasMany(models.Lobby, {
            foreignKey: 'ID_OWNER',
            as: 'lobbies'
        });
        User.hasMany(models.Message, {
            foreignKey: 'ID_USER',
            as: 'messages'
        });
        User.hasMany(models.GameRequests, {
            foreignKey: 'ID_USER',
            as: 'gameRequests'
        });
        User.belongsTo(models.Languages, {
            foreignKey: 'ID_LANGUAGE',
            as: 'languages'
        });
        User.hasMany(models.UserReview, {
            foreignKey: 'ID_REVIEWER',
            as: 'reviewer'
        });
        User.hasMany(models.UserReview, {
            foreignKey: 'ID_ABOUT',
            as: 'aboutUser'
        });
    };

    return User;
  };