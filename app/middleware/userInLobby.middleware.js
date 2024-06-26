const db = require("../models");
const Lobby = db.Lobby;
const UserIn = db.UserInLobby;
const User = db.User;
const Message = db.Message;
const Game = db.Game;
const Op = db.Sequelize.Op;

exports.getUserInLobby = async (req, res, lobbyId) => {  
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
            name_user_set.push(await User.findOne({ where: {ID_USER: user_set[i].ID_USER}, attributes: ['ID_USER', 'username', 'avatar']}));

        if(name_user_set.length==0){
            return res.status(404).send({message:"User in lobby not found!"});
        }

        let name_user = [];
        for(let i=0; i<name_user_set.length; i++)
            name_user.push([name_user_set[i].ID_USER, name_user_set[i].username, name_user_set[i].avatar]);

        res.status(200).send(name_user_set);

    }catch(error){
        res.status(500).send({message: "Error retrieving user in lobby: "+error.message});
    }     

};

exports.getOwner = async (req, res, lobbyId) => {  
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

exports.changeStillLoking = async (req, res, lobbyId) => {  
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

exports.updateDescription = async (req, res, lobbyId, description) => {  
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

exports.changeOwner = async (req, res, lobbyId, newOwnerId) => {  
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

exports.deleteUser = async (req, res, lobbyId, username) => {  
   
    try{
        //Sprawdzanie czy gracz istnieje
        const ifUserExist = await User.findOne({where: {username: username}, atributes: ['ID_USER']});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user!"});
        }

        //Sprawdzanie czy lobby istnieje
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});

        if(!ifLobbyExist){
            return res.status(404).send({message:"There is no such lobby!"});
        }

        //sprawdzanie czy użytkownik jest w lobby!
        const ifExist = await UserIn.findOne({where: {ID_LOBBY: Number(lobbyId), ID_USER: Number(ifUserExist.ID_USER)}});
        
        if(!ifExist){
            return res.status(405).send({message:"There is no such user in lobby!"});
        }


        //Sprawdzanie czy użytkownik nie jest właścicielem
        if(ifLobbyExist.ID_OWNER == ifUserExist.ID_USER){
            this.deleteLobby(req, res, lobbyId, ifUserExist.ID_USER);
        }

        //Usuwanie gracza z lobby
        await ifExist.destroy();

        res.status(200).send({ message: "Delete "+ ifUserExist.username+ " from lobby." });
    }catch(error){
        res.status(500).send({message: "Error during deleting user from lobby : "+error.message});
    }     
 
};

exports.deleteLobby = async (req, res, lobbyId, userId) => {  
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

exports.latest100 = async (req, res, lobbyId) => {  
    try{
        const ifLobbyExist = await Lobby.findOne({where: {ID_LOBBY: Number(lobbyId)}});
        
        if(!ifLobbyExist){
            res.status(404).send({message:"There is no such lobby!"});
        }

        const messages = await Message.findAll({
            where:{
                ID_LOBBY: lobbyId
            },
            limit: 100,
            attributes: ['ID_USER','ID_LOBBY','Message','Date','Time']
        })
        const usersIds = messages.map(user => user.ID_USER);
        const usernames = await User.findAll({
            where:{
                ID_USER:{
                    [Op.in]: usersIds
                }
            },
            attributes: ['ID_USER','username']
        })
        const messageData = messages.map(message => {
            const username = usernames.find(c => c.ID_USER === message.ID_USER);
            return {
                username: username ? username.dataValues.username : "Brak danych",
                message: message.Message,
                date: message.Date,
                time: message.Time,
            };
        });
    
        res.status(200).json({message: messageData});
    }
    catch(error){
        res.status(500).send({message: "Error during fetching messages : "+ error.message});
    }  

};

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
  
//lobbies that were active lately
exports.getLastLobbiesTop3 = async (req, res, userId) => {
    try {

        const userslobbies = await db.sequelize.query(
            `SELECT DISTINCT "ID_LOBBY" FROM "UserInLobby"
            WHERE "ID_USER" = ${userId}
            ORDER BY "ID_LOBBY";`,
            {
                type: db.sequelize.QueryTypes.SELECT
            });

        const lobbyUserIDs = userslobbies.map(lobby => lobby.ID_LOBBY);

        //getting 3 lobbies that was active lately (depending on last message)
        const LastLobbies = await db.sequelize.query(
            `SELECT MAX("Time"), "ID_LOBBY", "Date" FROM message
            WHERE "ID_LOBBY" IN (${lobbyUserIDs}) AND "Date" IN (
                SELECT MAX("Date") FROM message
                WHERE "ID_LOBBY" IN (${lobbyUserIDs})
                GROUP BY "ID_LOBBY")
            GROUP BY "ID_LOBBY", "Date"
            ORDER BY "Date" DESC, MAX("Time") DESC
            LIMIT 3;`, {
            type: db.sequelize.QueryTypes.SELECT
        });

        //getting data about this 3 lobbies
        const lobbyIds = LastLobbies.map(lobby => lobby.ID_LOBBY);
        const Lobbies = await Lobby.findAll({
            where: {
                Active: true,
                ID_LOBBY: {
                    [Op.in]: lobbyIds
                }
            },
            order: [
                ['ID_LOBBY', 'DESC'],
            ],
            attributes: ['ID_LOBBY','ID_OWNER','Name', 'Description','ID_GAME','NeedUsers']
        });

        //looking for owner avatar
        const ownerIds = Lobbies.map(lobby => lobby.ID_OWNER);
        const userAvatar = await User.findAll({
            where: {
                ID_USER: {
                    [Op.in]: ownerIds
                }
            },
            attributes: ['ID_USER','avatar'],
        });

        //looking for game name
        const gamesIDs = Lobbies.map(lobby=>lobby.ID_GAME);
        const games = await Game.findAll({
            where: {
                ID_GAME: {
                    [Op.in]: gamesIDs
                }
            },
            atributes: ['ID_GAME','name'],
        });
        
        //looking for number of players inside of lobby
        const counters = await UserIn.findAll({
            where: {
                ID_LOBBY: {
                    [Op.in]: lobbyIds
                },
                Accepted: true
            },
            attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
            group: 'ID_LOBBY'
          });
          
          //data preparation
          const lobbyData = Lobbies.map(lobby => {
              const counter = counters.find(c => c.ID_LOBBY === lobby.ID_LOBBY);
              const png = userAvatar.find(p => p.ID_USER === lobby.ID_OWNER);
              const game_name = games.find(g=> g.ID_GAME === lobby.ID_GAME);
              return {
                  ID_LOBBY: lobby.ID_LOBBY,
                  Name: lobby.Name,
                  Description: lobby.Description,
                  NeedUsers: lobby.NeedUsers,
                  ownerAvatar: png ? png.dataValues.avatar : "/img/default",
                  playerCount: counter ? counter.dataValues.playerCount : 0,
                  game_name: game_name ? game_name.dataValues.name : 'ni ma',
              };
          });

          //data sending
          res.status(200).json({Lobby: lobbyData});  

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getUserLobby = async (req, res, userId, page, size) => {  
    const { limit, offset } = getPagination(page, size);

    const alllobbies = await UserIn.count({
        where: {
            ID_USER: userId
        },
    });
  
    const userslobbies = await UserIn.findAll({
        where: {
            ID_USER: userId,
            Accepted: true
        },
        limit,
        offset,
        attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
        group: 'ID_LOBBY'
    });
    const lobbyIds = userslobbies.map(lobby => lobby.ID_LOBBY);
  
    const lobbies = await Lobby.findAll({
        where: {
            Active: true,
            ID_LOBBY: {
                [Op.in]: lobbyIds
            }
        },
        order: [
            ['ID_LOBBY', 'DESC'],
        ],
        attributes: ['ID_LOBBY','ID_OWNER','Name', 'Description','NeedUsers']
    });
    
    if (lobbies.length == 0) {
        return res.status(404).send({ message: "Lobby not found!" });
    }
  
    const ownerIds = lobbies.map(lobby => lobby.ID_OWNER);
  
    const userAvatar = await User.findAll({
        where: {
            ID_USER: {
                [Op.in]: ownerIds
            }
        },
        attributes: ['ID_USER','avatar'],
    });
  
    const counters = await UserIn.findAll({
      where: {
          ID_LOBBY: {
              [Op.in]: lobbyIds
          },
          Accepted: true
      },
      attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
      group: 'ID_LOBBY'
    });
  
    const lobbyData = lobbies.map(lobby => {
        const counter = counters.find(c => c.ID_LOBBY === lobby.ID_LOBBY);
        const png = userAvatar.find(p => p.ID_USER === lobby.ID_OWNER);
        return {
            ID_LOBBY: lobby.ID_LOBBY,
            Name: lobby.Name,
            Description: lobby.Description,
            NeedUsers: lobby.NeedUsers,
            ownerAvatar: png ? png.dataValues.avatar : "/img/default",
            playerCount: counter ? counter.dataValues.playerCount : 0,
        };
    });
  
    const numberOfPages = Math.ceil(alllobbies / limit);
    res.status(200).json({Lobby: lobbyData,pages: numberOfPages});  
};
