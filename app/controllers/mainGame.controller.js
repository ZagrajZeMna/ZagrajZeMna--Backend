const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const gameMiddleware = require('../middleware/games.middleware');

exports.getgamePagination = async (req, res) => {
    const { page, size, name} = req.query;
    gameMiddleware.getGame(req, res, page, size, name);
};

exports.getRecommendedGames = async (req, res) => {
    gameMiddleware.getRecomendedGames(req, res);
};
