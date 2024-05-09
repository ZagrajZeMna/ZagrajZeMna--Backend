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
        const user_set = await UserIn.findAll({ where: { ID_LOBBY: Number(lobbyId) } }, {
            attributes: ['ID_USER']
        });

        let name_user_set=[];
        for(let i=0; i<user_set.length; i++)
            name_user_set.push(await User.findOne({where: {ID_USER: user_set[i].ID_USER}}, {
              attributes: ['username', 'avatar']
        }));

        if(name_user_set.length==0){
            return res.status(404).send({message:"User in lobby not found!"});
        }

        let name_user = [];
        for(let i=0; i<name_user_set.length; i++)
            name_user.push([name_user_set[i].ID_USER, name_user_set[i].username, name_user_set[i].avatar]);
        res.status(200).send(name_user);

    }catch(error){
        res.status(500).send({message: "Error retrieving user in lobby: "+error.message});
    }     
    
};

//Funkcja, która na podstawie id lobby zwraca id i nickname właściciela.
exports.getOwnerLobbyData = async (req, res) => {
    const lobbyId = req.lobbyId;

    try{
        const lobbyOwner = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}}, {
            attributes: ['ID_OWNER']
        });
        
        if(lobbyOwner.length==0){
            return res.status(403).send({message:"Lobby owner not found!"});
        }
        const lobbyOwnerId = lobbyOwner.ID_OWNER;

        const lobbyOwnerData = await User.findOne({where: {ID_USER: lobbyOwnerId}}, {
            attributes: ['ID_USER', 'username']
        });

        if(lobbyOwnerData.length==0){
            return res.status(404).send({message:"Data of lobby owner not found!"});
        }
        const lobbyOwnerDataSet = [lobbyOwnerData.ID_USER, lobbyOwnerData.username];

        res.status(200).send(lobbyOwnerDataSet);
    }catch(error){
        res.status(500).send({message: "Error retrieving lobby owner: "+error.message});
    }     
    
};


