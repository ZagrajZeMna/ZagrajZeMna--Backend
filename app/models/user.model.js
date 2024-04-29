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
      allowNull: false,
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
