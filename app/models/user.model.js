module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    email: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    about: {
      type: Sequelize.TEXT
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
    status: {
      type: Sequelize.STRING
    },
    confirmationCode: {
      type: Sequelize.STRING,
      unique: true
    },
    avatar: {
      type: Sequelize.STRING
    },
    ID_LANGUAGE: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'languages', // To jest odniesienie do tabeli 'languages', która zostanie utworzona
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  return User;
};
