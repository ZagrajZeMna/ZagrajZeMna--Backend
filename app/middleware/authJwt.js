const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;

verifyToken = (req,res,next) => {
  const authHeader = req.headers['authorization'];
  console.log(req.headers['authorization']);
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(403).send({
          message: "Please log in!"
      });
  }

  jwt.verify(token,config.key.secret, function(err, decoded){
      if (err) {
          return res.status(403).json({ message: 'Invalid token' });
      }

      // Retrieve user ID from decoded token
      if (!decoded.ID_USER) {
          return res.status(403).json({ message: 'User ID not found in token' });
      }

      req.userId = decoded.ID_USER;
      req.token = token;
      next();
  });
};

verifyTokenNoti = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.status(403).send({
            message: "Please log in!"
        });
    }
  
    jwt.verify(token,config.key.secret, function(err, decoded){
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
  
        // Retrieve user ID from decoded token
        if (!decoded.ID_USER) {
            return res.status(403).json({ message: 'User ID not found in token' });
        }
  
        req.userId = decoded.ID_USER;
        req.token = token;
    });
  };

const authJwt = {
  verifyToken: verifyToken,
  verifyTokenNoti: verifyTokenNoti
};
module.exports = authJwt;