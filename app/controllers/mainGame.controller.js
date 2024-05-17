const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const Game = db.Game;

//pobranie tokena json
var jwt = require("jsonwebtoken");

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