const db = require('../models');
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.user;
const Language = db.language;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");

exports.addLanguage = async (req, res) => {
    
  const { language } = req.body;

  // Walidacja przesłanego języka
  if (!language || typeof language !== 'string' || language.trim() === '') {
    return res.status(400).send({ message: "Language field is required and must be a string." });
  }

  try {
    // Sprawdzenie, czy język już istnieje
    const languageExists = await Language.findOne({ where: { language: language.trim() } });
    if (languageExists) {
      return res.status(409).send({ message: "Language already exists." });
    }

    // Dodanie nowego języka
    const newLanguage = await Language.create({ language: language.trim() });
    
    res.status(201).send({
      message: "Language added successfully.",
      language: newLanguage
    });
  } catch (error) {
    res.status(500).send({ message: "Error adding language: " + error.message });
  }
};

/* Opcjda dla admina, zmienić swagger i dodać kolumnę IsAdmin
Ale nie chce mi się dodawać
exports.addLanguage = async (req, res) => {
  const userId = req.user.id; // ID użytkownika z dekodowanego tokena JWT

  try {
    // Wczytaj informacje o użytkowniku, aby sprawdzić, czy jest adminem
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Sprawdź, czy użytkownik jest adminem
    if (!user.isAdmin) {
      return res.status(403).send({ message: "You are not authorized to perform this action." });
    }

    const { language } = req.body;

    // Walidacja przesłanego języka
    if (!language || typeof language !== 'string' || language.trim() === '') {
      return res.status(400).send({ message: "Language field is required and must be a string." });
    }

    // Sprawdzenie, czy język już istnieje
    const languageExists = await Language.findOne({ where: { language: language.trim() } });
    if (languageExists) {
      return res.status(409).send({ message: "Language already exists." });
    }

    // Dodanie nowego języka do bazy danych
    const newLanguage = await Language.create({ language: language.trim() });
    
    // Odpowiedź sukcesu z dodanym językiem
    res.status(201).send({
      message: "Language added successfully.",
      language: newLanguage
    });
  } catch (error) {
    // W przypadku błędu, zwróć odpowiedź z błędem
    res.status(500).send({ message: "Error adding language: " + error.message });
  }
};
*/


/*
exports.deleteLanguage = async (req, res) => {
  const languageId = parseInt(req.params.id, 10);

  if (isNaN(languageId)) {  // Sprawdzenie czy `id` jest liczbą
    return res.status(400).send({ message: "Invalid language ID." });
  }

  try {
    const language = await Language.findByPk(languageId);
    if (!language) {
      return res.status(404).send({ message: "Language not found." });
    }

    await language.destroy();
    res.status(200).send({ message: "Language deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: "Error deleting language: " + error.message });
  }
};


"/api/admin/deleteLanguage": {
      "delete": {
        "tags": [
          "Admin"
        ],
        "summary": "Usuwanie języka",
        "description": "Usuwa język na podstawie podanego ID.",
        "operationId": "deleteLanguage",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID języka do usunięcia",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Język został pomyślnie usunięty"
          },
          "404": {
            "description": "Nie znaleziono języka"
          },
          "500": {
            "description": "Wewnętrzny błąd serwera"
          }
        }
      }
    },


    */