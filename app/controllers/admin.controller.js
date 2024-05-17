const db = require("../models");
const Game = db.Game;

exports.addNewGame = (req, res) => {
    const { name, description, image } = req.body;
    Game.create({
      name: name,
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