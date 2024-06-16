const db = require("../models");

const Lobby = db.Lobby;
const User = db.User;
const Game = db.Game;
const Shelf = db.Shelf;
const Languages = db.Languages;
const UIL = db.UserInLobby;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

 


exports.showLobby = async (req, res, page, size, game, name, sorting, language) => {
    var games = game ? game : "VALORANT";

    //sorting
    const defaultSorting = [['ID_LOBBY', 'DESC']];
    const sort = sorting ? [[sorting, 'ASC']]: defaultSorting;

    //language
    const lang = language ? language : [];

    const findLang = await Languages.findOne({
        where: {
            LANGUAGE: lang
        },
        attributes: ['ID_LANGUAGE']
    });


    // title/desc serach
    var condition = {};
    if (name) {
        condition[Op.or] = [
            { Name: { [Op.iLike]: `%${name}%` } }, 
            { Description: { [Op.iLike]: `%${name}%` } }
        ];
    }

    const { limit, offset } = getPagination(page, size);

    Game.findOne({
        where: {
            name: games,
        }
    }).then( async(game)=>{
        try{
            const allLobbies = await Lobby.count({
                where: {
                    ...condition,
                    ID_LANGUAGE: findLang ? findLang.ID_LANGUAGE : { [Op.not]: null },
                    ID_GAME: game.ID_GAME,
                    Active: true,
                    StillLooking: true
                }
            });
        const lobbies = await Lobby.findAll({
            where: {
                ...condition,
                ID_LANGUAGE: findLang ? findLang.ID_LANGUAGE : { [Op.not]: null },
                ID_GAME: game.ID_GAME,
                Active: true,
                StillLooking: true
            },
            order: sort,
            limit,
            offset,
            attributes: ['ID_LOBBY','ID_OWNER','Name', 'Description','NeedUsers']
        });

        if (lobbies.length == 0) {
            return res.status(404).send({ message: "Lobby not found!" });
        }
    const numberOfPages = Math.ceil(allLobbies / limit);
    const lobbyIds = lobbies.map(lobby => lobby.ID_LOBBY);
    const ownerIds = lobbies.map(lobby => lobby.ID_OWNER);

    const counters = await UIL.findAll({
        where: {
            ID_LOBBY: {
                [Op.in]: lobbyIds
            },
            Accepted: true
        },
        attributes: ['ID_LOBBY', [db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']],
        group: 'ID_LOBBY'
    });

    const userAvatar = await User.findAll({
        where: {
            ID_USER: {
                [Op.in]: ownerIds
            }
        },
        attributes: ['ID_USER','avatar'],
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
            playerCount: counter ? counter.dataValues.playerCount : 0
        };
    });

    res.status(200).json({Lobby: lobbyData, Pages: numberOfPages});
    }
    catch(err){
        res.status(500).send({ message: err.message }); 
    }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    }); 
};

exports.addLobby = async (req, res, userId, gameName, language, Name, Description, NeedUsers) => {
    User.findOne({
        where: {
            ID_USER: userId
        }
    }).then((user)=>{
        Game.findOne({
        where: {
            name: gameName
        }
        })
        .then((game)=>{
            Languages.findOne({
                where: {
                    LANGUAGE: language
                },
            })
            .then((language)=>{
                Lobby.create({
                    ID_OWNER: user.ID_USER,
                    ID_GAME: game.ID_GAME,
                    Name: Name,
                    Description: Description,
                    ID_LANGUAGE: language.ID_LANGUAGE,
                    NeedUsers: NeedUsers
                    }).then(async (lobby) =>{
                        await UIL.create({
                            ID_USER: userId,
                            ID_LOBBY: lobby.ID_LOBBY,
                            Accepted: true
                        })
                        res.json({ message: "Lobby created successfully!" });
                    }).catch(err => {
                        res.status(500).send({ message: err.message });
                });
            })
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
});
};

