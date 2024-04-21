module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
    ID_USER: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    confirmationCode: {
        type: Sequelize.STRING,
        unique: true
    }
    });
    
    

    return User;
  };