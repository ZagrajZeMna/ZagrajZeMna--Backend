const db = require("../models");
const User = db.User;
const messages = db.Message;
const UIL = db.UserInLobby;
const Lobby = db.Lobby;

exports.saveMessage = async (message, username, room) => {
    username = username;
    room = room;
    recived_message = message;
    const localdate = new Date();
    try{
        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(room)}});
        
        if(!ifLobbyExist){
            res.status(404).send({message:"There is no such lobby!"});
        }

        //Sprawdzanie czy wiadomość nie jest pusta
        if(!recived_message){
            res.status(406).send({message:"Message is incorrect!"});
        }

        const chatuser = await User.findOne({
            where:{
                username: username
            },
            attributes: ['ID_USER']
        })
        // //Sprawdzanie czy gracz należy do lobby
        // const ifUserInLobbyExist = await UIL.findOne({where: {ID_USER: Number(chatuser.ID_USER), ID_LOBBY: Number(room)}});
        
        // if(!ifUserInLobbyExist){
        //     return res.status(405).send({message:"This user is not in lobby!"});
        // }

        messages.create({
            ID_USER: chatuser.ID_USER,
            ID_LOBBY: room,
            Message: recived_message,
            Date: (localdate.getUTCFullYear()+"-"+(localdate.getUTCMonth()+1)+"-"+localdate.getUTCDate()),
            Time: (localdate.getUTCHours()+":"+localdate.getUTCMinutes()+":"+localdate.getUTCSeconds())
        })
        next();
      }
      catch(err){
        console.log(err);
      } 
};
