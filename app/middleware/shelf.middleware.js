const db = require("../models");
const Shelf = db.Shelf;

exports.addGameToUserShelf = async (userId, gameId, res) => {
  try {
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