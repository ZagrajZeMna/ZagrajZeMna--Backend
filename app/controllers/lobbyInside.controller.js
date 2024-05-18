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

//Funkcja, która na podstawie id lobby zwraca wszystkie wiadomości w danym lobby.
exports.getMessageList = async (req, res) => {
    const lobbyId = req.lobbyId;


    try{
       const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});
        
        if(!ifLobbyExist){
            return res.status(403).send({message:"There is no lobby with that id!"});
        }
 
        const message_set = await Message.findAll({where: {ID_LOBBY: Number(lobbyId)}, 
        limit: 100, order: [['Date', 'DESC'], ['Time', 'DESC']]},{
            attributes: ['ID_MESSAGE', 'ID_USER', 'Message', 'Date', 'Time']
        });
        
        if(message_set.length==0){
            return res.status(404).send({message:"Message in lobby not found!"});
        }
        
        //let message_set_response = []
        //for(let i=0; i<message_set.length; i++)
            //message_set_response.push([message_set[i].ID_MESSAGE, message_set[i].ID_USER, message_set[i].Message, message_set[i].Date, message_set[i].Time]);
        
        //message_set_response.reverse();
        res.status(200).send(message_set);//_response);
    }catch(error){
        res.status(500).send({message: "Error retrieving message in lobby: "+error.message});
    }     
    
};


//Funkcja, która na podstawie id gracza dodaje go do lobby.
exports.addUser = async (req, res) => {
    const lobbyId = req.lobbyId;
    const userId = req.userId;

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

        //Sprawdzanie czy użytkownik jest już w lobby
        const ifUserInLobbyExist = await UserIn.findOne({where: {ID_LOBBY: Number(lobbyId), ID_USER: Number(userId)}});

        if(ifUserInLobbyExist){
            return res.status(405).send({message:"This user is already in lobby!"});
        }

        //Sprawdzanie czy lobby nie jest pełne
        const userset = await UserIn.findALL({where: {ID_LOBBY: Number(lobbyId)}});

        if((ifLobbyExist.NeedUsers>=userset.length) || !(ifLobbyExist.StillLooking)){
            return res.status(406).send({message:"Lobby is full!"});
        }

        //Dodawanie gracza do lobby
        const newUser = await UserIn.create({
            ID_USER: userId,
            ID_LOBBY: lobbyId
          });
      
//          res.status(200).send({
//            message: "User was added to lobby.",
//            userInLobbyDetails: {
//              ID_UIL: newUser.ID_UIL,
//             ID_USER: newUser.ID_USER,
//              ID_LOBBY: newUser.ID_LOBBY
//            }
//          });
      
        const userName = await User.findOne({where: {ID_USER: Number(userId)}});

        res.status(200).send({ message: "Add "+ userName.username+ " to lobby." });
    }catch(error){
        res.status(500).send({message: "Error during adding user to lobby : "+error.message});
    }     
            
};

//Funkcja, która dodaję recenzje o użytkowniku
exports.addRewiev = async (req, res) => {
    const reviewerId = req.reviewerId;
    const aboutId = req.aboutId;
    const stars = req.stars;
    const description = req.description;
    const localdate = new Date();

    try{
        //Sprawdzanie czy ktoś nie wystawia opini o samym sobie
        if(reviewerId == aboutId){
            return res.status(403).send({message:"Users can't leave reviews for themself!"});
        }

        //Sprawdzanie czy gracz wystawiający opinie istnieje
        const ifReviewerExist = await User.findOne({where: {ID_USER: Number(reviewerId)}});
        
        if(!ifReviewerExist){
            return res.status(404).send({message:"There is no such user. Id of reviewer is incorrect!"});
        }

        //Sprawdzanie czy gracz, któremu wystawiają opinie istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(aboutId)}});
        
        if(!ifUserExist){
            return res.status(405).send({message:"There is no such user. Id of user is incorrect!"});
        }

        //Sprawdzanie czy gracz, któremu wystawiają opinie istnieje
        const ifReviewExist = await Review.findOne({where: {ID_REVIEWER: Number(reviewerId), ID_ABOUT: Number(aboutId),}});
        
        if(ifReviewExist){
            return res.status(406).send({message:"Reviewer is alrady leave review about this user!"});
        }


        //Sprawdzanie czy ocena jest podana w skali całkowitej w przedziale <1, 5>
        if(stars<1 || stars>5 || (parseInt(stars) != stars)){
            return res.status(407).send({message:"Stars are incorrect!"});
        }

        //Sprawdzanie czy opinia jest tekstem 
        if(!description){
            return res.status(408).send({message:"Description is incorrect!"});
        }

        //Dodawanie recenzji
        const newReview = await Review.create({
            ID_REVIEWER: reviewerId,
            ID_ABOUT: aboutId,
            stars: stars,
            description: description,
            date: (localdate.getUTCFullYear()+"-"+(localdate.getUTCMonth()+1)+"-"+localdate.getUTCDate()),
            time: (localdate.getUTCHours()+":"+localdate.getUTCMinutes()+":"+localdate.getUTCSeconds())
          });
      
          res.status(200).send({
            message: "Review was added to database.",
            newRewievDetails: {
              ID_REVIEW: newReview.ID_REVIEW,
              ID_REVIEWER: newReview.ID_REVIEWER,
              ID_ABOUT: newReview.ID_ABOUT,
              stars: newReview.stars,
              description: newReview.description,
              date: newReview.date,
              time: newReview.time
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding review : "+error.message});
    }     

};

//Funkcja, która dodaję wiadomość
exports.addMessage = async (req, res) => {
    const userId = req.userId;
    const lobbyId = req.lobbyId;
    const message = req.message;
    const localdate = new Date();
    
    try{
        //Sprawdzanie czy gracz istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(userId)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user!"});
        }

        //Sprawdzanie czy gracz istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});
        
        if(!ifLobbyExist){
            return res.status(404).send({message:"There is no such lobby!"});
        }

        //Sprawdzanie czy gracz należy do lobby
        const ifUserInLobbyExist = await UserIn.findOne({where: {ID_USER: Number(userId), ID_LOBBY: Number(lobbyId)}});
        
        if(!ifUserInLobbyExist){
            return res.status(405).send({message:"This user is not in lobby!"});
        }

        //Sprawdzanie czy wiadomość jest tekstem 
        if(!message){
            return res.status(406).send({message:"Message is incorrect!"});
        }

        //Dodawanie wiadomości
        const newMessage = await Message.create({
            ID_USER: userId,
            ID_LOBBY: lobbyId,
            Message: message,
            Date: (localdate.getUTCFullYear()+"-"+(localdate.getUTCMonth()+1)+"-"+localdate.getUTCDate()),
            Time: (localdate.getUTCHours()+":"+localdate.getUTCMinutes()+":"+localdate.getUTCSeconds())
          });
      
          res.status(200).send({
            message: "Message was added to database.",
            newMessageDetails: {
              ID_USER: newMessage.ID_USER,
              ID_LOBBY: newMessage.ID_LOBBY,
              Message: newMessage.Message,
              Date: newMessage.Date,
              Time: newMessage.Time
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding message : "+error.message});
    }     

};


//Funkcja, która na podstawie id gracza usuwa go z lobby.
exports.deleteUser = async (req, res) => {
    const lobbyId = req.lobbyId;
    const userId = req.userId;
    var newOwnerId = null;
    if(req.newOwnerId){
        newOwnerId = req.newOwnerId;
        
        const newUserExist = await User.findOne({where: {ID_USER: Number(userId)}});
        if(newUserExist)
            return res.status(407).send({message:"New owner is not user!"});

        const newUserInlobby = await UserIn.findOne({where: {ID_USER: Number(userId)}});
        if(newUserInlobby)
            return res.status(408).send({message:"New owner is not in Lobby!"});

    }

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
            if(!newOwnerId) 
                return res.status(406).send({message:"Can't remove lobby owner!"});
            await Lobby.update({ ID_OWNER: newOwnerId});
        }

                
        //await UserIn.delete({where: {ID_LOBBY: Number(lobbyId), ID_USER: Number(userId)}});
        //Usuwanie gracza z lobby
        await ifExist.destroy();

        const userName = await User.findOne({where: {ID_USER: Number(userId)}});

        res.status(200).send({ message: "Delete "+ userName.username+ " from lobby." });
    }catch(error){
        res.status(500).send({message: "Error during deleting user from lobby : "+error.message});
    }     
            
};

//Funkcja, która usuwa lobby.
exports.deleteLobby = async (req, res) => {
    const lobbyId = req.lobbyId;
    const userId = req.userId;

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

        //Sprawdzanie czy poprawnie pobrano listę użytkowników
        if(ifLobbyExist.ID_OWNER != ifUserExist.ID_USER){
            return res.status(407).send({message:"Lobby is now unactive, but list of user in lobby still exists!"});
        }

        for(let i=0; i<user_set.length; i++)
            await user_set[i].destroy();
        
        res.status(200).send({ message: "Lobby was set as unactive." });
    }catch(error){
        res.status(500).send({message: "Error during deleting lobby : "+error.message});
    }     
            
};

