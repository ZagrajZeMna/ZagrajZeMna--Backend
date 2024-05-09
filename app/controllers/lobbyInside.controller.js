const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const Lobby = db.Lobby;
//const Game = db.Game;
const UserIn = db.UserInLobby;
const User = db.User;
//const Message = db.Message;

//pobranie tokena json
var jwt = require("jsonwebtoken");

//Funkcja, która na podstawie id lobby zwraca nicki oraz ścieżki do awatara użytkowników, którzy są wewnątrz danego lobby
exports.getUserList = async (req, res) => {
    const lobbyId = req.lobbyId;

    try{
        const user_set = await UserIn.findOne({ where: { ID_LOBBY: lobbyId } }, {
            attributes: ['ID_USER']
        });

        const name_user_set =await User.findByPk(user_set, {
            attributes: ['username', 'avatar']
        });

        if(name_user_set.length==0){
            return res.status(404).send({message:"User in lobby not found!"});
        }
        res.status(200).send(name_user_set);
    }catch(error){
        res.status(500).send({message: "Error retrieving user in lobby: "+error.massage});
    }     
    
};

//Funkcja, która na podstawie id lobby zwraca id i nickname właściciela.
exports.getOwnerLobbyData = async (req, res) => {
    const lobbyId = 1;//req.lobbyId;

    try{
        const lobbyOwnerId = await Lobby.findByPk(lobbyId, {
            attributes: ['ID_OWNER']
        });
        
        if(lobbyOwnerId.length==0){
            return res.status(403).send({message:"Lobby owner not found!"});
        }
        const lobbyOwnerData = await User.findByPk(lobbyOwnerId, {
            attributes: ['ID_USER', 'nickname']
        });

        if(lobbyOwnerData.length==0){
            return res.status(404).send({message:"Data of lobby owner not found!"});
        }
        res.status(200).send(lobbyOwnerData);
    }catch(error){
        res.status(500).send({message: "Error retrieving lobby owner: "+error.massage});
    }     
    
};


