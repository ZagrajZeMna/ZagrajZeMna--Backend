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

  exports.deleteGame = (req, res) => {
    const { name } = req.params;
    Game.destroy({
        where: { name: name }
    })
    .then(deletedCount => {
        if (deletedCount > 0) {
            res.status(200).json({ message: "Game deleted successfully!" });
        } else {
            res.status(404).json({ message: "Game not found." });
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Failed to delete game.", error: err });
    });
};

exports.banUser = async (req, res) => {
  const { id } = req.body; // Id użytkownika do zbanowania

  try {
      const user = await User.findByPk(id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      user.isBanned = true;
      await user.save();

      res.status(200).json({ message: `User ${user.username} has been banned.` });
  } catch (error) {
      res.status(500).json({ message: "Failed to ban user.", error: error });
  }
};

exports.unbanUser = async (req, res) => {
  const { id } = req.body; // Id użytkownika do odbanowania

  try {
      const user = await User.findByPk(id);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      user.isBanned = false;
      await user.save();

      res.status(200).json({ message: `User ${user.username} has been unbanned.` });
  } catch (error) {
      res.status(500).json({ message: "Failed to unban user.", error: error });
  }
};