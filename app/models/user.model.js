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
    }
    },
    {
    timestamps: false
    });

    User.associate = function(models) {
        User.hasMany(models.UserInLobby, {
            foreignKey: 'ID_USER',
            as: 'userInLobbies'
        });
    };


    User.associate = function(models) {
        User.hasMany(models.Shelf, {
            foreignKey: 'ID_USER',
            as: 'shelves'
        });
    };


    User.associate = function(models) {
        User.hasMany(models.Lobby, {
            foreignKey: 'ID_OWNER',
            as: 'lobbies'
        });
    };

    User.associate = function(models) {
        User.hasMany(models.Message, {
            foreignKey: 'ID_USER',
            as: 'messages'
        });
        User.hasMany(models.GameRequests, {
            foreignKey: 'ID_USER',
            as: 'gameRequests'
        });
        User.hasMany(models.UserReview, {
            foreignKey: 'ID_REVIEWER',
            as: 'reviewsGiven'
        });
        User.hasMany(models.UserReview, {
            foreignKey: 'ID_ABOUT',
            as: 'reviewsReceived'
        });
    };


    return User;
  };