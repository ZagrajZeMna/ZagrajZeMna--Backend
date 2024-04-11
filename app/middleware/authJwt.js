const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  try {
    const decoded = jwt.verify(token,config.key.secret);
    req.userId = decoded.id;
    next();
  } 
  catch (err) {
    res.clearCookie("token");
    res.status(401).json({ error: 'Invalid token' });
  }
  };

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
