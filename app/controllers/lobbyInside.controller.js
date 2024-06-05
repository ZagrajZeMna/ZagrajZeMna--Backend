const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const Lobby = db.Lobby;
const UserIn = db.UserInLobby;
const User = db.User;
const Message = db.Message;
const Review = db.UserReview;

//pobranie tokena json
var jwt = require("jsonwebtoken");

//Funkcja, która na podstawie id lobby zwraca nicki oraz ścieżki do awatara użytkowników, którzy są wewnątrz danego lobby
exports.getUserList = async (req, res) => {
    const {lobbyId} = req.query;

    try{
        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});

        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no such lobby!"});
        }

        const user_set = await UserIn.findAll({ where: { ID_LOBBY: Number(lobbyId), Accepted: true }}, {
            attributes: ['ID_USER']
        });

        let name_user_set=[];
        for(let i=0; i<user_set.length; i++)
            name_user_set.push(await User.findOne({ where: {ID_USER: user_set[i].ID_USER}, attributes: ['username', 'avatar']}));

        if(name_user_set.length==0){
            return res.status(404).send({message:"User in lobby not found!"});
        }

        let name_user = [];
        for(let i=0; i<name_user_set.length; i++)
            name_user.push([ name_user_set[i].username, name_user_set[i].avatar]);

        res.status(200).send(name_user_set);

    }catch(error){
        res.status(500).send({message: "Error retrieving user in lobby: "+error.message});
    }     
    
};

//Funkcja, która na podstawie id lobby zwraca id i nickname właściciela.
exports.getOwnerLobbyData = async (req, res) => {
    const {lobbyId} = req.query;

    try{
        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});

        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no such lobby!"});
        }

                
        const lobbyOwner = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}, 
            attributes: ['ID_OWNER']
        });
        
        if(!lobbyOwner){
            return res.status(404).send({message:"Lobby owner not found!"});
        }
        const lobbyOwnerId = lobbyOwner.ID_OWNER;

        const lobbyOwnerData = await User.findOne({where: {ID_USER: lobbyOwnerId},
            attributes: ['ID_USER', 'username']
        });

        if(!lobbyOwnerData){
            return res.status(405).send({message:"Data of lobby owner not found!"});
        }
        //const lobbyOwnerDataSet = [lobbyOwnerData.ID_USER, lobbyOwnerData.username];

        res.status(200).send(lobbyOwnerData);
    }catch(error){
        res.status(500).send({message: "Error retrieving lobby owner: "+error.message});
    }     
    
};

//Funkcja zmieniająca ustawienia lobby
exports.updateLobbyStillLooking = async (req, res) => {
    const {lobbyId} = req.query;

    try{
        //Sprawdzanie, czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});
        
        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no such lobby!"});
        }

        if(ifLobbyExist.StillLooking == null){
            await ifLobbyExist.update({StillLooking: 1});
        }
        else{
            await ifLobbyExist.update({StillLooking: !(ifLobbyExist.StillLooking)});
        }
        
        res.status(200).send({message: "Lobby data StillLooking set to: " + ifLobbyExist.StillLooking});
        
    }catch(error){
        res.status(500).send({message: "Error during update lobby data StillLooking: "+error.message});
    } 

};

//Funkcja zmieniająca ustawienia lobby
exports.updateLobbyDescription = async (req, res) => {
    const {lobbyId, description} = req.query;
    
    try{
        //Sprawdzanie, czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}, attributes:['ID_LOBBY', 'Description']});
        
        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no such lobby!"});
        }

        if(ifLobbyExist.Description == description)
            return res.status(404).send({message:"Description has already that value!"});

        if(description == null)
            await ifLobbyExist.update({Description: null});
        
        await ifLobbyExist.update({Description: description});
      
        res.status(200).send({message: "Lobby description was changed."});
      
    }catch(error){
        res.status(500).send({message: "Error during update lobby description: "+error.message});
    }     

};

//Funkcja zmieniająca właściciela lobby
exports.changeLobbyOwner = async (req, res) => {
    const {lobbyId, newOwnerId} = req.query;

    try{
        //Sprawdzanie, czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}, attributes: ['ID_LOBBY', 'ID_OWNER']});
        
        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no such lobby!"});
        }

        //Sprawdzanie, czy gracz istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(newOwnerId)}, attributes:['ID_USER', 'username']});
        
        if(!ifUserExist){
            return res.status(404).send({message:"There is no such user!"});
        }

        //Sprawdzanie czy użytkownik jest w lobby
        const ifUserInLobbyExist = await UserIn.findOne({where: {ID_LOBBY: Number(lobbyId), ID_USER: Number(newOwnerId)}});
        
        if(!ifUserInLobbyExist){
            return res.status(405).send({message:"New owner is not in lobby!"});
        }


        if(ifLobbyExist.ID_OWNER == newOwnerId){
            return res.status(406).send({message:"New owner is the old one!"});
        }

        await ifLobbyExist.update({ID_OWNER: newOwnerId});
        
        res.status(200).send({message: "Lobby has new Owner: " + ifUserExist.username});
    }catch(error){
        res.status(500).send({message: "Error during upgrade lobby data: "+error.message});
    }     

};


//Funkcja, która na podstawie id gracza usuwa go z lobby.
exports.deleteUser = async (req, res) => {
    const {lobbyId, userId} = req.query;
    
    try{
        //Sprawdzanie czy gracz istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(userId)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user!"});
        }

        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});

        if(!ifLobbyExist){
            return res.status(404).send({message:"There is no such lobby!"});
        }

        //sprawdzanie czy użytkownik jest w lobby!
        const ifExist = await UserIn.findOne({where: {ID_LOBBY: Number(lobbyId), ID_USER: Number(userId)}});
        
        if(!ifExist){
            return res.status(405).send({message:"There is no such user in lobby!"});
        }


        //Sprawdzanie czy użytkownik nie jest właścicielem
        if(ifLobbyExist.ID_OWNER == ifUserExist.ID_USER){
                return res.status(406).send({message:"Can't remove lobby owner!"});
        }

        //Usuwanie gracza z lobby
        await ifExist.destroy();

        res.status(200).send({ message: "Delete "+ ifUserExist.username+ " from lobby." });
    }catch(error){
        res.status(500).send({message: "Error during deleting user from lobby : "+error.message});
    }     
            
};

//Funkcja, która usuwa lobby.
exports.deleteLobby = async (req, res) => {
    const {lobbyId, userId} = req.query;

    try{
        //Sprawdzanie czy gracz istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(userId)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user!"});
        }

        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});

        if(!ifLobbyExist){
            return res.status(404).send({message:"There is no such lobby!"});
        }

        //sprawdzanie czy lobby jest aktywne
        if(!ifLobbyExist.Active){
            return res.status(405).send({message:"Lobby is already unactive!"});
        }

        //Sprawdzanie czy użytkownik nie jest właścicielem
        if(ifLobbyExist.ID_OWNER != ifUserExist.ID_USER){
            return res.status(406).send({message:"Only lobby owner can remove lobby!"});
        }
                
        //Ustawianie lobby jako nieaktywne
        await ifLobbyExist.update({Active: 0});

        //Usuwanie wszystkich użytkowników z lobby
        const user_set = await UserIn.findAll({ where: { ID_LOBBY: Number(lobbyId) } });

        for(let i=0; i<user_set.length; i++)
            await user_set[i].destroy();
        
        res.status(200).send({ message: "Lobby was set as unactive." });
    }catch(error){
        res.status(500).send({message: "Error during deleting lobby : "+error.message});
    }     
            
};

