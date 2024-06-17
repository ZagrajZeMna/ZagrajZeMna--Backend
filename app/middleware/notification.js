const db = require("../models");
const Lobby = db.Lobby;
const User = db.User;
const Noti = db.Notification;
const UIL = db.UserInLobby;
const Op = db.Sequelize.Op;

exports.join = async (data,ID,token,req, res) => {
    try{
        const ownerID = await Lobby.findOne({
          where:{
            ID_LOBBY: data
          },
          attributes: ['ID_OWNER','Name']
        })
        const userID = await User.findOne({
          where:{
            ID_USER: ID
          },
          attributes: ['username']
        })
        console.log("HOST ID:  ",ownerID.ID_OWNER);
        const destination = await User.findOne({
          where:{
            ID_USER: ownerID.ID_OWNER
          },
          attributes: ['confirmationCode']
        })
        const username = userID.username;
        lobbyName = ownerID.Name; 
        let result = [];
        if(token != destination.confirmationCode){
          const amountNedded = await Lobby.findOne({
            where:{
              ID_LOBBY: data,
            },
            attributes: ['NeedUsers']
          })
          const amountCurrent = await UIL.findAll({
            where:{
              ID_LOBBY: data
            },
            //attributes: [[db.sequelize.fn('COUNT', 'ID_USER'), 'playerCount']]
            attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('ID_USER')), 'playerCount']]
          })
          console.log("Liczba potrzebna: ",amountNedded.NeedUsers)
          console.log("Liczba aktualna: ",amountCurrent[0].get('playerCount'))
          const amountNow = amountCurrent[0].get('playerCount');
          const notification = await Noti.findOne({
            where:{
                ID_USER: ID,
                ID_LOBBY: data
            }
          })
          const userinL = await UIL.findOne({
            where:{
              ID_USER: ID,
              ID_LOBBY: data
            },
            attributes: ['Accepted']
          })

          if(userinL == null && notification == null && amountNedded.NeedUsers > amountNow){
              Noti.create({
                ID_HOST: ownerID.ID_OWNER,
                ID_USER: ID,
                ID_LOBBY: data,
                message: `Użytkownik ${username} poprosił o dołączenie do lobby: ${lobbyName}!`,
                status: "Active",
                type: "Respond"
              })
              result.push(
                destination.confirmationCode,
                username,
                lobbyName,
              )
              console.log(result)
              return result;
          }
        }
      }
      catch(err){
        console.log(err);
      } 
};
  
exports.accept = async (ID,Desc,IDLobby) => {
    try{      
    let result = [];
    await Noti.findOne({
        where:{
          ID_NOTI: ID
        }
      }).then(async (noti) => {
        await User.findOne({
          where:{
            ID_USER: noti.ID_USER
          }
        }).then(async (user)=>{
          await User.findOne({
            where:{
              ID_USER: noti.ID_HOST
            }
          }).then(async (host)=>{     
            await Noti.create({
              ID_HOST: noti.ID_USER,
              ID_USER: noti.ID_HOST,
              ID_LOBBY: IDLobby,
              message: `Gracz "${host.username}" zaakceptował twoją prośbę o dołączenie do lobby`,
              status: "Active",
              type: "Info"
            })
            await Noti.destroy({
              where:{
                ID_NOTI: ID
              }
            })
            await UIL.create({
              ID_USER: noti.ID_USER,
              ID_LOBBY: IDLobby,
              Accepted: true
            })  
            data = "Accepted";
            lobbyName = Desc;
            result.push(
                user.confirmationCode,
                data,
                host.username,
            )
            console.log(result)

          })
        })
      })
      return result;
    }
    catch(err){
        console.log(err);
    } 
};

exports.decline = async (ID,Desc,IDLobby) => {
    try{      
    let result = [];
    await Noti.findOne({
        where:{
          ID_NOTI: ID
        }
      }).then(async (noti) => {
        await User.findOne({
          where:{
            ID_USER: noti.ID_USER
          }
        }).then(async (user)=>{
          await User.findOne({
            where:{
              ID_USER: noti.ID_HOST
            }
          }).then(async (host)=>{     
            await Noti.create({
              ID_HOST: noti.ID_USER,
              ID_USER: noti.ID_HOST,
              ID_LOBBY: IDLobby,
              message: `Gracz "${host.username}" odrzucił twoją prośbę o dołączenie do lobby`,
              status: "Active",
              type: "Info"
            })
            await Noti.destroy({
              where:{
                ID_NOTI: ID
              }
            })
            await UIL.create({
              ID_USER: noti.ID_USER,
              ID_LOBBY: IDLobby,
              Accepted: false
            })  
            data = "rejected";
            lobbyName = Desc;
            result.push(
                user.confirmationCode,
                data,
                host.username,
            )
          })
        })
      })
      return result;
    }
    catch(err){
        console.log(err);
    } 
};

exports.showNot = async (req, res, userId) => {
  const notifi = await Noti.findAll({
    where:{
        ID_HOST: userId,
        type: "Respond"
    },
})
if (notifi.length == 0) {
    return res.status(404).send({ message: "Notifications not found!" });
}  
const notiIds = notifi.map(user => user.ID_USER);  

const userAvatar = await User.findAll({
  where: {
      ID_USER: { [Op.in]: notiIds }
  },
  attributes: ['ID_USER', 'avatar'] 
});

const notiData = notifi.map(user => {
  const png = userAvatar.find(p => p.ID_USER === user.ID_USER); 
  return {
      idNoti: user.ID_NOTI,
      idLobby: user.ID_LOBBY,
      message: user.message,
      ownerAvatar: png ? png.avatar : 'https://res.cloudinary.com/dcqhaa1ez/image/upload/v1716977307/default.png',
      senderId: user.ID_USER,
  };
});


res.status(200).json({Notification: notiData});

};

exports.showInfoNot = async (req, res, userId) => {
  const notifi = await Noti.findAll({
    where:{
        ID_HOST: userId,
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
        ownerAvatar: png ? png.dataValues.avatar : 'https://res.cloudinary.com/dcqhaa1ez/image/upload/v1716977307/default.png',
    };
}); 

res.status(200).json({Notification: notiData});

};

exports.deleteNot = async (req, res, id) => {
  Noti.destroy({
    where:{
     ID_NOTI: id
    } 
 }).then((noti)=>{
     res.status(200).json("Pomyślnie usunięto");
 }).catch(err => {
     res.status(500).send({ message: err.message });
 }); 

};
