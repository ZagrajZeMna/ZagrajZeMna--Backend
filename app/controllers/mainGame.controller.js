const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const Game = db.Game;
const Op = db.Sequelize.Op;

//pobranie tokena json
var jwt = require("jsonwebtoken");


const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};


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
    const { page, size} = req.query;

    const { limit, offset } = getPagination(page, size);

    try{
        const allGames = await Game.count();

        const gameSet = await Game.findAll({
            limit,
            offset,
            attributes: ['ID_GAME','name', 'image']
        });

        if (gameSet.length == 0) {
            return res.status(404).send({ message: "Game not found!" });
        }
    
        const numberOfPages = Math.ceil(allGames / limit);

        res.status(200).json({Game: gameSet, Pages: numberOfPages});
    }
    catch(err){
        res.status(500).send({ message: err.message }); 
    }
    
};
