const db = require("../models");
const Languages = db.Languages;

exports.fetchAllLanguages = async (req, res) => {
  try {
    const languages = await Languages.findAll({
      attributes: ['ID_LANGUAGE', 'LANGUAGE']
    });

    if (languages.length === 0) {
      return res.status(404).send({ message: "Languages not found." });
    }

    return res.status(200).send(languages);
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving languages: " + error.message });
  }
};
