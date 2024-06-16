const db = require("../models");
const Game = db.Game;
const Op = db.Sequelize.Op;
const Languages = db.Languages;
const sequelize = db.sequelize;

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
};

exports.getRecomendedGames = async (req, res) => {
    try {
        const recommendedGames = await sequelize.query(`
            SELECT g.name, g.image, COUNT(l."ID_LOBBY") as lobbyCount
            FROM public.games g
            JOIN public.lobbies l ON g."ID_GAME" = l."ID_GAME"
            GROUP BY g."ID_GAME", g.name, g.image
            ORDER BY lobbyCount DESC
            LIMIT 5;
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).send(recommendedGames);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving recommended games: " + error.message });
    }
};

exports.getInfoToLobby = async (req, res, gameName) => {
    try{
        const game_set = await Game.findOne({
            where: {name: gameName},
            attributes: ['description', 'image']
        });
        res.status(200).send(game_set);
    }
    catch(error){
        res.status(500).send({message: "Error retrieving game data"});
    }

};

exports.getData = async (req, res) => {
    Game.findAll({
        attributes: ['name']
    }).then((Games)=>{
        Languages.findAll({
            attributes: ['LANGUAGE']
        }).then((languages)=>{
            res.json({Languages: languages, Games: Games});
        })
    })
};

