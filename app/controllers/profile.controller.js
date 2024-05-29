const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Languages = db.Languages;
const Game = db.Game;
const Lobby = db.Lobby;
const Shelf = db.Shelf;
const UIL = db.UserInLobby;

const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: 'dcqhaa1ez',
  api_key: '334823839869595',
  api_secret: 'jhBEa7mL2z_mnlbCsEAEYklusbI'
});

exports.getUserDetails = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['email', 'username', 'about', 'country', 'city', 'contact', 'ID_LANGUAGE']
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

    res.status(200).send(userWithLanguage);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.userId;
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
  const userId = req.userId;
  const newUsername = req.body.username;

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

exports.updateAbout = async (req, res) => {
  const userId = req.userId;
  const { about } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Aktualizacja pola about
    await user.update({ about });

    res.status(200).send({
      message: "About information updated successfully.",
      about: about
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating about information: " + error.message });
  }
};

exports.updateCountry = async (req, res) => {
  const userId = req.userId;
  const { country } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Aktualizacja kraju użytkownika
    await user.update({ country });

    res.status(200).send({
      message: "Country updated successfully.",
      country: country
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating country: " + error.message });
  }
};


exports.updateCity = async (req, res) => {
  const userId = req.userId;
  const { city } = req.body; 

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Aktualizacja miasta użytkownika
    await user.update({ city });

    res.status(200).send({
      message: "City updated successfully.",
      city: city
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating city: " + error.message });
  }
};

exports.updateContact = async (req, res) => {
  const userId = req.userId;
  const { contact } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Aktualizacja informacji kontaktowej użytkownika
    await user.update({ contact });

    res.status(200).send({
      message: "Contact information updated successfully.",
      contact: contact
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating contact information: " + error.message });
  }
};


exports.postAvatarLink = async (req, res) => {
  const userId = req.userId;
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

      // Jeśli użytkownik ma już avatar, usuń go z Cloudinary
      if (user.avatar) {
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

exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Languages.findAll({
      attributes: ['ID_LANGUAGE', 'LANGUAGE']
    });
    
    if (languages.length === 0) {
      return res.status(404).send({ message: "Languages not found." });
    }

    res.status(200).send(languages);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving languages: " + error.message });
  }
};

exports.setUserLanguage = async (req, res) => {
  const userId = req.userId;
  const { languageId } = req.body;

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
      res.status(200).send({ message: "User language updated successfully." });
    } else {
      res.status(404).send({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating user language: " + error.message });
  }
};

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.usersLobby = async (req,res) =>{
  //pagination
  const page = req.body.page;
  const size = req.body.size;
  const { limit, offset } = getPagination(page, size);

  const alllobbies = await UIL.count({
      where: {
          ID_USER: req.userId
      },
  });

  const userslobbies = await UIL.findAll({
      where: {
          ID_USER: req.userId
      },
      limit,
      offset,
      attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
      group: 'ID_LOBBY'
  });

  const lobbyIds = userslobbies.map(lobby => lobby.ID_LOBBY);

  const lobbies = await Lobby.findAll({
      where: {
          Active: true,
          ID_LOBBY: {
              [Op.in]: lobbyIds
          }
      },
      order: [
          ['ID_LOBBY', 'DESC'],
      ],
      attributes: ['ID_LOBBY','ID_OWNER','Name', 'Description','NeedUsers']
  });
  
  if (lobbies.length == 0) {
      return res.status(404).send({ message: "Lobby not found!" });
  }

  const ownerIds = lobbies.map(lobby => lobby.ID_OWNER);

  const userAvatar = await User.findAll({
      where: {
          ID_USER: {
              [Op.in]: ownerIds
          }
      },
      attributes: ['ID_USER','avatar'],
  });
  
  const lobbyData = lobbies.map(lobby => {
      const counter = userslobbies.find(c => c.ID_LOBBY === lobby.ID_LOBBY);
      const png = userAvatar.find(p => p.ID_USER === lobby.ID_OWNER);
      return {
          ID_LOBBY: lobby.ID_LOBBY,
          Name: lobby.Name,
          Description: lobby.Description,
          NeedUsers: lobby.NeedUsers,
          ownerAvatar: png ? png.dataValues.avatar : "/img/default",
          playerCount: counter ? counter.dataValues.playerCount : 0,
      };
  });

  const numberOfPages = Math.ceil(alllobbies / limit);
  res.status(200).json({Lobby: lobbyData,pages: numberOfPages});
};

exports.usersGames = async (req,res) =>{
  //pagination
  const page = req.body.page;
  const size = req.body.size;
  const { limit, offset } = getPagination(page, size);

  const allGames = await Shelf.count({
      where: {
          ID_USER: req.userId
      },
  })

  const shelfs = await Shelf.findAll({
      where: {
          ID_USER: req.userId
      },
      limit,
      offset,
      attributes: ['ID_GAME'],
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });

  if (shelfs.length == 0) {
      return res.status(404).send({ message: "Games not found!" });
  }

  const games = shelfs.map(Game => Game.ID_GAME);
  const numberOfPages = Math.ceil(allGames / limit);

  Game.findAll({
      where:{
          ID_GAME: {
              [Op.in]: games
          }
      },
      attributes: ['name','shortname','image']
  }).then((games)=>{
      res.json({Games: games, Pages: numberOfPages});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.addGameToShelf = async (req, res) => {
  const userId = req.userId;
  const { ID_GAME } = req.body;

  try {
    const existingShelf = await Shelf.findOne({
      where: {
        ID_USER: userId,
        ID_GAME: ID_GAME
      }
    });

    if (existingShelf) {
      return res.status(409).send({
        message: "Ta gra jest już na twojej półce."
      });
    }

    const newShelf = await Shelf.create({
      ID_USER: userId,
      ID_GAME: ID_GAME
    });

    res.status(201).send({
      message: "Gra została dodana do półki.",
      shelfDetails: {
        ID_SHELF: newShelf.ID_SHELF,
        ID_USER: newShelf.ID_USER,
        ID_GAME: newShelf.ID_GAME
      }
    });
  } catch (error) {
    console.error("Error during creating shelf: ", error);
    res.status(500).send({ message: "Validation error" });
  }
};

exports.removeGameFromShelf = async (req, res) => {
  const userId = req.userId;
  const { ID_GAME } = req.body; 

  try {
    const shelf = await Shelf.findOne({
      where: {
        ID_USER: userId,
        ID_GAME: ID_GAME
      }
    });

    if (!shelf) {
      return res.status(404).send({
        message: "Nie znaleziono gry na półce tego użytkownika."
      });
    }

    // Usunięcie znalezionego rekordu
    await shelf.destroy();

    res.status(200).send({
      message: "Gra została usunięta z półki."
    });
  } catch (error) {
    console.error("Error during removing game from shelf: ", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getUserStats = async (req, res) => {
  const userId = req.userId;

  try {
      // Liczenie gier na półce użytkownika
      const gamesCount = await Shelf.count({
          where: { ID_USER: userId }
      });

      // Liczenie lobby, do których użytkownik jest przypisany
      const lobbiesCount = await UIL.count({
          where: { ID_USER: userId }
      });

      res.status(200).send({
          gamesOnShelf: gamesCount,
          lobbiesJoined: lobbiesCount
      });
  } catch (error) {
      res.status(500).send({ message: "Error retrieving user stats: " + error.message });
  }
};
