const db = require("../models");
const Shelf = db.Shelf;
const Game = db.Game;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.addGameToUserShelf = async (userId, gameName, res) => {
  try {
      const game = await Game.findOne({
          where: {
              name: gameName
          }
      });

      if (!game) {
          return res.status(404).send({
              message: "Gra nie została znaleziona."
          });
      }

      const gameId = game.ID_GAME;

      const existingShelf = await Shelf.findOne({
          where: {
              ID_USER: userId,
              ID_GAME: gameId
          }
      });

      if (existingShelf) {
          return res.status(409).send({
              message: "Ta gra jest już na twojej półce."
          });
      }

      const newShelf = await Shelf.create({
          ID_USER: userId,
          ID_GAME: gameId
      });

      return res.status(201).send({
          message: "Gra została dodana do półki.",
          shelfDetails: {
              ID_SHELF: newShelf.ID_SHELF,
              ID_USER: newShelf.ID_USER,
              ID_GAME: newShelf.ID_GAME
          }
      });
  } catch (error) {
      console.error("Error during creating shelf: ", error);
      return res.status(500).send({ message: "Validation error" });
  }
};


exports.removeGameFromUserShelf = async (userId, gameId, res) => {
    try {
      const shelf = await Shelf.findOne({
        where: {
          ID_USER: userId,
          ID_GAME: gameId
        }
      });
  
      if (!shelf) {
        return res.status(404).send({
          message: "Nie znaleziono gry na półce tego użytkownika."
        });
      }
  
      // Usunięcie znalezionego rekordu
      await shelf.destroy();
  
      return res.status(200).send({
        message: "Gra została usunięta z półki."
      });
    } catch (error) {
      console.error("Error during removing game from shelf: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
};

exports.getUserGame = async (req, res, userId, page, size) => {
    const { limit, offset } = getPagination(page, size);

    const allGames = await Shelf.count({
        where: {
            ID_USER: userId
        },
    })
  
    const shelfs = await Shelf.findAll({
        where: {
            ID_USER: userId
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