const db = require("../models");
const config = require("../config/auth.config");
const Game = db.Game;
const User = db.User;
const Noti = db.Notification;
const Op = db.Sequelize.Op;

exports.show = async (req, res) => {
    const notifi = await Noti.findAll({
        where:{
            ID_HOST: req.userId,
            type: "Respond"
        },
    })
    if (notifi.length == 0) {
        return res.status(404).send({ message: "Notifications not found!" });
    }  
    const notiIds = notifi.map(user => user.ID_USER);  

    const userAvatar = await User.findAll({
        where:{
            ID_USER: {[Op.in]: notiIds}
        },
        attributes: ['avatar']
    })

    const notiData = notifi.map(user => {
        const png = userAvatar.find(p => p.ID_USER === user.ID_USER);
        return {
            idNoti: user.ID_NOTI,
            idLobby: user.ID_LOBBY,
            message: user.message,
            ownerAvatar: png ? png.dataValues.avatar : "/img/default",
        };
    }); 
    
    res.status(200).json({Notification: notiData});
};

exports.showinfo = async (req, res) => {
    const notifi = await Noti.findAll({
        where:{
            ID_HOST: req.userId,
            type: "Info"
        },
    })
    if (notifi.length == 0) {
        return res.status(404).send({ message: "Notifications not found!" });
    }  
    const notiIds = notifi.map(user => user.ID_USER);  
    const userAvatar = await User.findAll({
        where:{
            ID_USER: {[Op.in]: notiIds}
        },
        attributes: ['avatar']
    })

    const notiData = notifi.map(user => {
        const png = userAvatar.find(p => p.ID_USER === user.ID_USER);
        return {
            idNoti: user.ID_NOTI,
            message: user.message,
            ownerAvatar: png ? png.dataValues.avatar : "/img/default",
        };
    }); 
    
    res.status(200).json({Notification: notiData});
};

exports.delete = (req,res) => {
    Noti.destroy({
       where:{
        ID_NOTI: req.body.id
       } 
    }).then((noti)=>{
        res.status(200).json("Pomyślnie usunięto");
    }).catch(err => {
        res.status(500).send({ message: err.message });
    }); 

};