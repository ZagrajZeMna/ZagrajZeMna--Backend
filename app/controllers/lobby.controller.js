const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { all } = require("axios");
const Lobby = db.Lobby;
const User = db.User;
const Game = db.Game;
const Shelf = db.Shelf;
const Languages = db.Languages;
const UIL = db.UserInLobby;
const Op = db.Sequelize.Op;

const lobbyMiddleware = require("../middleware/lobby.middleware");
const gameMiddleware = require("../middleware/games.middleware");


exports.show = async (req, res) => {
    const { page, size, game, name, sorting, language} = req.query;
    lobbyMiddleware.showLobby(req, res, page, size, game, name, sorting, language);
};

exports.add = (req,res) =>{
    const userId = req.userId;
    const {gameName, language, Name, Description, NeedUsers} = req.body;
    lobbyMiddleware.showLobby(req, res, userId, gameName, language, Name, Description, NeedUsers);

};

exports.data = (req,res) =>{
    gameMiddleware.getData(req, res);
};

exports.gameinfo = async (req,res) =>{
    const {gameName} = req.query;
    gameMiddleware.getInfoToLobby(req, res, gameName);
};

