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
      type: Sequelize.STRING
    },
    confirmationCode:{
      type: Sequelize.STRING,
      unique: true
    }     
  },
  {
    timestamps: false
});

  return User;
};
