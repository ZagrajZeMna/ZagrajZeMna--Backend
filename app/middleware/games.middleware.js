const db = require("../models");
const Game = db.Game;

exports.addGame = async (req, res, name, shortname, description, image) => {  
    try {
        const existingGame = await Game.findOne({ where: { name } });
        
        if (existingGame) {
            return res.status(400).send({ message: 'A game with this name already exists.' });
        }
        
        const newGame = await Game.create({
            name,
            shortname,
            description,
            image
        });

        res.status(201).send(newGame);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};