const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.user;
const Role = db.role;

const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).send({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).send({ message: "New passwords do not match." });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Old password is incorrect." });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).send({ message: "New password must be different from the old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).send({ message: "Password successfully changed." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.postUsername = (req, res) => {
  const userId = req.user.id; // Pobranie ID użytkownika z dekodowanego tokena JWT
  const newUsername = req.body.username; // Pobranie nowego username z ciała żądania

  if (!newUsername) {
      return res.status(400).send({ message: "Username cannot be empty." });
  }

  // Sprawdzenie, czy username jest już używane
  User.findOne({ where: { username: newUsername } })
      .then(user => {
          if (user) {
              return res.status(409).send({ message: "This username is already taken." });
          }

          // Znalezienie użytkownika po ID i aktualizacja jego username
          User.findByPk(userId)
              .then(user => {
                  if (!user) {
                      return res.status(404).send({ message: "User not found." });
                  }

                  user.update({ username: newUsername })
                      .then(() => {
                          res.status(200).send({
                              message: "Username has been successfully updated.",
                              username: newUsername
                          });
                      })
                      .catch(err => {
                          res.status(500).send({ message: err.message });
                      });
              })
              .catch(err => {
                  res.status(500).send({ message: err.message });
              });
      })
      .catch(err => {
          res.status(500).send({ message: err.message });
      });
};

exports.postAvatarLink = async (req, res) => {
  const userId = req.user.id;
  const avatarLink = req.body.avatarLink;

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  const getFileSize = async (url) => {
    try {
      const response = await axios.head(url);
      return response.headers['content-length'];
    } catch (error) {
      console.error('Error fetching file size:', error);
      return null;
    }
  };

  if (!isValidUrl(avatarLink)) {
    return res.status(400).send({ message: "Invalid URL provided." });
  }

  const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
  if (!allowedExtensions.test(avatarLink)) {
    return res.status(400).send({ message: "Avatar link must point to a .jpg, .jpeg, or .png file." });
  }

  const fileSize = await getFileSize(avatarLink);
  if (!fileSize || fileSize > 5000000) {
    return res.status(400).send({ message: "Avatar must be less than 5MB." });
  }

  User.findByPk(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      user.update({ avatar: avatarLink })
        .then(() => {
          res.status(200).send({
            message: "Avatar has been successfully updated.",
            avatarLink: avatarLink
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.postAvatarFile = (req, res) => {
  // Konfiguracja przechowywania plików multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      // Tworzenie unikalnej nazwy pliku
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  // Filtr plików multer, który akceptuje tylko określone typy obrazów
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
    }
  };

  // Konfiguracja multer
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
  }).single('avatar');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Please upload an avatar." });
    }

    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) {
        fs.unlinkSync(req.file.path);
        return res.status(404).send({ message: "User not found." });
      }

      if (user.avatar) {
        // Usuń poprzedni plik awatara
        const oldAvatarPath = path.join(__dirname, '..', 'uploads', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Zaktualizuj użytkownika z nową ścieżką awatara
      const updatedUser = await user.update({ avatar: req.file.filename });

      res.status(200).send({
        message: "Avatar successfully uploaded.",
        avatar: req.file.filename
      });

    } catch (error) {
      // Usuń nowy plik, jeśli nie można zaktualizować użytkownika
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).send({ message: error.message });
    }
  });
};