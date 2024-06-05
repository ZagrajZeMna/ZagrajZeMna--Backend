const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const User = db.User;
const Languages = db.Languages;
const Game = db.Game;
const Lobby = db.Lobby;
const Shelf = db.Shelf;
const UIL = db.UserInLobby;

exports.getUser = async (req, res) => {  
    try {
        const users = await User.findAll({
            attributes: ['ID_USER', 'email', 'username', 'avatar', 'isBanned'],
            order: [['username', 'ASC']]
        });

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getBannedUser = async (req, res) => {  
    try {
        const users = await User.findAll({
            attributes: ['ID_USER', 'email', 'username', 'avatar', 'isBanned'],
            where: {
                isBanned: true
            },
            order: [['username', 'ASC']]
        });

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getNotBannedUser = async (req, res) => {  
    try {
        const users = await User.findAll({
            attributes: ['ID_USER', 'email', 'username', 'avatar', 'isBanned'],
            where: {
                isBanned: false
            },
            order: [['username', 'ASC']]
        });

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.banUser = async (req, res) => {  
    try {
        const userId = req.body.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (user.isBanned) {
            return res.status(400).send({ message: "User is already banned." });
        }

        user.isBanned = true;
        await user.save();

        res.status(200).send({ message: "User has been banned." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.unbanUser = async (req, res) => {  
    try {
        const userId = req.body.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (!user.isBanned) {
            return res.status(400).send({ message: "User is not banned." });
        }

        user.isBanned = false;
        await user.save();

        res.status(200).send({ message: "User has been unbanned." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getUserIfno = async (req, res) => {  
    try {
        const userId = req.body.id;
        const user = await User.findByPk((userId),{
        attributes: ['ID_USER','email', 'username', 'about', 'country', 'city', 'contact', 'isAdmin']
        });
  
        res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
};

exports.addNewGame = (req, res) => {
    const { name, shortname, description, image } = req.body;
    Game.create({
      name: name,
      shortname: shortname,
      description: description,
      image: image
    })
    .then(game => {
      res.status(201).json({ message: "Game created successfully!", game: game });
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create game.", error: err });
    });
};