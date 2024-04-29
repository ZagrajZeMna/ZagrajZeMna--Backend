module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    status:{
      type: Sequelize.STRING,
      defaultValue: 'Created'
    },
    confirmationCode:{
      type: Sequelize.STRING,
      unique: true
    },
    IsAdmin:{
      type: Sequelize.STRING,
      defaultValue: 'No',
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

  return User;
};
