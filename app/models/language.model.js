module.exports = (sequelize, Sequelize) => {
    const Language = sequelize.define("languages", {
      language: {
        type: Sequelize.STRING
      }
    }, {
      timestamps: false
    });
  
    return Language;
  };
  