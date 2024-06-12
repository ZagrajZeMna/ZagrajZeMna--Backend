const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const sequelize = db.sequelize;
const Game = db.Game;
const Lobby = db.Lobby;

const gameMiddleware = require('../middleware/games.middleware');

//Funkcja pobierająca nazwy gier i ścieżki obrazów z bazy danych i wysyłające je na front
exports.getGame = async (req, res) => {
    try{
        const game_set = await Game.findAll({
            attributes: ['name', 'image']
        });

        if(game_set.length==0){
            return res.status(404).send({message:"Game not found!"});
        }
        res.status(200).send(game_set);
    }catch(error){
        res.status(500).send({message: "Error retrieving game: "+error.massage});
    }     
    
};


exports.getgamePagination = async (req, res) => {
    const { page, size, name} = req.query;
    gameMiddleware.getGame(req, res, page, size, name);
};

exports.getRecommendedGames = async (req, res) => {
    try {
        const recommendedGames = await sequelize.query(`
            SELECT g.name, g.image, COUNT(l."ID_LOBBY") as lobbyCount
            FROM public.games g
            JOIN public.lobbies l ON g."ID_GAME" = l."ID_GAME"
            GROUP BY g."ID_GAME", g.name, g.image
            ORDER BY lobbyCount DESC
            LIMIT 7;
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        res.status(200).send(recommendedGames);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving recommended games: " + error.message });
    }
};