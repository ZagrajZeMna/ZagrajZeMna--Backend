const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const controller = require("../controllers/auth.controller");
const db = require("../models");
const User = db.User;
var bcrypt = require("bcryptjs");

verifyAdmin = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token);
    if (!token) {
      return res.status(403).send({
        message: "Please log in!"
      });
    }
    jwt.verify(token,config.key.admin, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'You don`t have access' });
        }
        req.user = decoded;
        next();
    });
};

verifyBan = (req, res, next) => {
    User.findOne({
        where:{
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }        
        if(user.IsBanned === "Yes"){
            res.status(403).send({message: "You are banned"});
        }
        if(user.IsBanned === "No"){
            next();
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

const authAcc = {
  verifyAdmin: verifyAdmin,
  verifyBan: verifyBan,
};
module.exports = authAcc;
