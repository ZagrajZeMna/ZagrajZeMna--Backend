const db = require("../models");
const Game = db.Game;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

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

exports.getGame = async (req, res, page, size, name) => {
    const { limit, offset } = getPagination(page, size);

    var condition = {};
    if (name) {
        condition[Op.or] = [
            { name: { [Op.iLike]: `%${name}%` } }
        ];
    }

    try{
        const allGames = await Game.count({
            where: {...condition}});

        const gameSet = await Game.findAll({
            where: {...condition},
            limit,
            offset,
            attributes: ['ID_GAME','name', 'image']
        });

        if (gameSet.length == 0) {
            return res.status(404).send({ message: "Game not found!" });
        }

        const numberOfPages = Math.ceil(allGames/ limit);

        res.status(200).json({Game: gameSet, Pages: numberOfPages});
    }
    catch(err){
        res.status(500).send({ message: err.message }); 
    }    
}