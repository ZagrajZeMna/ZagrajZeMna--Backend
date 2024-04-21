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
    IsBanned:{
      type: Sequelize.STRING,
      defaultValue: 'No',
    }         
  },
  {
    timestamps: false
});

  return User;
};
