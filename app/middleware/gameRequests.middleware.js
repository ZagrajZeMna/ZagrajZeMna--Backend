const db = require("../models");
const User = db.User;
const GameReq = db.GameRequests;

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

exports.addGameReq = async (req, res, user_id, name_game, description) => {  
    try{
        //Sprawdzanie czy gracz wysyłający prośbę istnieje
        const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}});
        
        if(!ifUserExist){
            return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
        }

        //Dodawanie recenzji
        const newGameReq = await GameReq.create({
            ID_USER: user_id,
            GameName: name_game,
            Description: description
        });
      
        res.status(200).send({
            message: "Game request was send.",
            gameRequestDetails: {
              ID_REQUEST: newGameReq.ID_REQUEST,
              ID_USER: newGameReq.ID_USER,
              GameName: newGameReq.GameName,
              Description: newGameReq.Description,
            }
          });
      
    }catch(error){
        res.status(500).send({message: "Error during adding request: "+error.message});
    }     

};

exports.getGameReq = async (req, res, page, size) => {
    const { limit, offset } = getPagination(page, size);

    try{
        const allGame = await GameReq.count();

        const gameSet = await GameReq.findAll({
            limit,
            offset,
            attributes: ['ID_REQUEST', 'ID_USER','GameName', 'Description']
        });

        if (gameSet.length == 0) {
            return res.status(404).send({ message: "There is no request!" });
        }

        let game_user_set=[];
        var id;
        var user;
        var name;
        var description;
        for(let i=0; i< gameSet.length; i++){
            id = gameSet[i].ID_REQUEST;
            user = await User.findOne({ where: {ID_USER: gameSet[i].ID_USER}, attributes: ['username']});
            user = user.username;
            name = gameSet[i].GameName;
            description = gameSet[i].Description;
            game_user_set.push({id, user, name, description});
        }
    
        const numberOfPages = Math.ceil(allGame/ limit);


        res.status(200).json({game: game_user_set, Pages: numberOfPages});

    }catch(error){
        res.status(500).send({message: "Error during sending report list : "+error.message});
    }     
   
};

exports.deleteGameReqMiddle = async (req, res, r_id) => {
    try {
        if (!r_id) {
            return res.status(400).send({ message: "Request ID is required" });
        }

        // Sprawdzanie, czy prośba istnieje
        const ifExist = await GameReq.findOne({ where: { ID_REQUEST: Number(r_id) } });
        
        if (!ifExist) {
            return res.status(404).send({ message: "There is no such request!" });
        }

        // Usuwanie prośby z listy
        await ifExist.destroy();

        res.status(200).send({ message: "Delete Game request." });
    } catch (error) {
        res.status(500).send({ message: "Error during deleting request: " + error.message });
    }     
};

