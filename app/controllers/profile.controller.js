const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Languages = db.Languages;
const Game = db.Game;
const Lobby = db.Lobby;
const Shelf = db.Shelf;
const UIL = db.UserInLobby;
const Op = db.Sequelize.Op;

const userMiddleware = require("../middleware/user.middleware");
const languageMiddleware = require("../middleware/language.middleware");
const shelfMiddleware = require("../middleware/shelf.middleware");

exports.getUserDetails = (req, res) => {
  const userId = req.userId;
  userMiddleware.fetchUserDetails(req, res, userId);
};

exports.changePassword = (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  userMiddleware.postChangePassword(req, res, userId, oldPassword, newPassword, confirmPassword);
};

exports.postUsername = (req, res) => {
  const userId = req.userId;
  const newUsername = req.body.username;
  userMiddleware.updateUsername(req, res, userId, newUsername);
};

exports.updateAbout = (req, res) => {
  const userId = req.userId;
  const about = req.body.about;
  userMiddleware.postAbout(req, res, userId, about);
};

exports.updateCountry = (req, res) => {
  const userId = req.userId;
  const { country } = req.body;
  userMiddleware.postCountry(req, res, userId, country);
};

exports.updateCity = (req, res) => {
  const userId = req.userId;
  const { city } = req.body;
  userMiddleware.postCity(req, res, userId, city);
};

exports.updateContact = (req, res) => {
  const userId = req.userId;
  const { contact } = req.body;
  userMiddleware.postContact(req, res, userId, contact);
};

exports.postAvatarFile = (req, res) => {
  const userId = req.userId;
  userMiddleware.updateAvatarFile(req, res, userId);
};

exports.getAllLanguages = (req, res) => {
  languageMiddleware.fetchAllLanguages(req, res);
};

exports.setUserLanguage = (req, res) => {
  const userId = req.userId;
  const { languageId } = req.body;
  userMiddleware.updateUserLanguage(userId, languageId, res);
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

  const counters = await UIL.findAll({
    where: {
        ID_LOBBY: {
            [Op.in]: lobbyIds
        },
        Accepted: true
    },
    attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
    group: 'ID_LOBBY'
  });

  const lobbyData = lobbies.map(lobby => {
      const counter = counters.find(c => c.ID_LOBBY === lobby.ID_LOBBY);
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

exports.addGameToShelf = (req, res) => {
  const userId = req.userId;
  const { ID_GAME } = req.body;
  shelfMiddleware.addGameToUserShelf(userId, ID_GAME, res);
};

exports.removeGameFromShelf = (req, res) => {
  const userId = req.userId;
  const { ID_GAME } = req.body;
  shelfMiddleware.removeGameFromUserShelf(userId, ID_GAME, res);
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
