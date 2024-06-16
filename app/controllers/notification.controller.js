const db = require("../models");
const config = require("../config/auth.config");
const Game = db.Game;
const User = db.User;
const Noti = db.Notification;
const Op = db.Sequelize.Op;

const notiMiddleware = require('../middleware/notification.js');

exports.show = async (req, res) => {
    const userId = req.userId;
    notiMiddleware.showNot(req, res, userId);
};

exports.showinfo = async (req, res) => {
    const userId = req.userId;
    notiMiddleware.showInfoNot(req, res, userId);
};

exports.delete = (req,res) => {
    const id = req.body.id;
    notiMiddleware.deleteNot(req, res, id);
};