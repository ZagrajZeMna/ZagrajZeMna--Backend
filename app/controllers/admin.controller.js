const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Languages = db.Languages;
const Game = db.Game;
const Lobby = db.Lobby;
const Shelf = db.Shelf;
const UIL = db.UserInLobby;

const gameMiddleware = require('../middleware/games.middleware');
const userMiddleware = require("../middleware/user.middleware");

exports.getUser = (req, res) => {  
    userMiddleware.fetchUsers(req, res);
};

exports.banUser = (req, res) => {
    const userId = req.body.id;
    userMiddleware.banUsers(req, res, userId);
};

exports.unbanUser = (req, res) => {
    const userId = req.body.id;
    userMiddleware.unbanUsers(req, res, userId);
};

exports.getUserIfno = async (req, res) => {  
    const userId = req.body.id;
    userMiddleware.fetchUserInfo(req, res, userId);
};


exports.addNewGame = (req, res) => {
    const { name, shortname, description, image } = req.body;
    gameMiddleware.addGame(req, res, name, shortname, description, image);
};