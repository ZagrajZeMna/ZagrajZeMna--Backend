const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const userMiddleware = require("../middleware/user.middleware");
const languageMiddleware = require("../middleware/language.middleware");
const shelfMiddleware = require("../middleware/shelf.middleware");
const userInLobbyMiddleware = require("../middleware/userInLobby.middleware");


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

exports.usersLobby = async (req,res) =>{
  const page = req.body.page;
  const size = req.body.size;
  const userId = req.userId;
  userInLobbyMiddleware.getUserLobby(req, res, userId, page, size);
};

exports.usersGames = async (req,res) =>{
  const page = req.body.page;
  const size = req.body.size;
  const userId= req.userId;
  shelfMiddleware.getUserGame(req, res, userId, size, page);
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
  userMiddleware.getStatus(req, res, userId);
};
