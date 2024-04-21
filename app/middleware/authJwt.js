const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token);
  if (!token) {
    return res.status(403).send({
      message: "Please log in!"
    });
  }
  jwt.verify(token,config.key.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Add the decoded user information to the request object
    req.user = decoded;
    next();
  });
  };

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
