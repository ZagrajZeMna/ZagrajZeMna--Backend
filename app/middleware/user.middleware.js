const db = require("../models");
const User = db.User;
const Languages = db.Languages;

const multer = require('multer');
var bcrypt = require("bcryptjs");

// Konfiguracja Cloudinary
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dcqhaa1ez',
  api_key: '334823839869595',
  api_secret: 'jhBEa7mL2z_mnlbCsEAEYklusbI'
});

const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dcqhaa1ez/image/upload/v1716977307/default.png';

exports.fetchUserDetails = async (req, res, userId) => {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['email', 'username', 'about', 'avatar', 'country', 'city', 'contact', 'ID_LANGUAGE']
      });
  
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      // Konwersja ID_LANGUAGE na nazwę języka
      const language = await Languages.findByPk(user.ID_LANGUAGE);
      const userWithLanguage = {
        ...user.get({ plain: true }),
        language: language ? language.LANGUAGE : null
      };
  
      return res.status(200).send(userWithLanguage);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

exports.postChangePassword = async (req, res, userId, oldPassword, newPassword, confirmPassword) => {
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
  
      return res.status(200).send({ message: "Password successfully changed." });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

exports.updateUsername = async (req, res, userId, newUsername) => {
    if (!newUsername) {
      return res.status(400).send({ message: "Username cannot be empty." });
    }
  
    try {
      const userWithSameUsername = await User.findOne({ where: { username: newUsername } });
      if (userWithSameUsername) {
        return res.status(409).send({ message: "This username is already taken." });
      }
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ username: newUsername });
  
      return res.status(200).send({
        message: "Username has been successfully updated.",
        username: newUsername,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  };

  exports.postAbout = async (req, res, userId, about) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ about });
  
      return res.status(200).send({
        message: "About information updated successfully.",
        about: about,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating about information: " + error.message });
    }
};

exports.postCountry = async (req, res, userId, country) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ country });
  
      return res.status(200).send({
        message: "Country updated successfully.",
        country: country,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating country: " + error.message });
    }
  };
  
  exports.postCity = async (req, res, userId, city) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ city });
  
      return res.status(200).send({
        message: "City updated successfully.",
        city: city,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating city: " + error.message });
    }
  };
  
  exports.postContact = async (req, res, userId, contact) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ contact });
  
      return res.status(200).send({
        message: "Contact information updated successfully.",
        contact: contact,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating contact information: " + error.message });
    }
  };

exports.updateAvatarFile = (req, res) => {
    // Konfiguracja przechowywania plików multer
  const storage = multer.memoryStorage();
  
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
      const userId = req.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Przesyłanie obrazu do Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }).end(req.file.buffer);
      });

      // Sprawdzenie, czy obecny avatar to domyślny URL
      if (user.avatar && user.avatar !== DEFAULT_AVATAR_URL) {
        const publicId = user.avatar.match(/\/([^\/]+)\.[^\/]+$/)[1];
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            console.error('Failed to delete old avatar from Cloudinary:', error);
          } else {
            console.log('Old avatar successfully deleted from Cloudinary');
          }
        });
      }

      // Zaktualizuj użytkownika z nowym URL awatara
      const updatedUser = await user.update({ avatar: result.secure_url });

      res.status(200).send({
        message: "Avatar successfully uploaded.",
        avatar: result.secure_url
      });

    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};

exports.updateUserLanguage = async (userId, languageId, res) => {
    try {
      // Sprawdź, czy wybrany język istnieje w bazie danych
      const languageExists = await Languages.findByPk(languageId);
      if (!languageExists) {
        return res.status(404).send({ message: "Language not found." });
      }
  
      // Znajdź i zaktualizuj użytkownika
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ ID_LANGUAGE: languageId });
        return res.status(200).send({ message: "User language updated successfully." });
      } else {
        return res.status(404).send({ message: "User not found." });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error updating user language: " + error.message });
    }
  };