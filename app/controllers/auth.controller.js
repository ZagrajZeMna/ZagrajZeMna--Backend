const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const admin = require("../middleware/authAcc")

const User = db.User;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const userMiddleware = require("../middleware/user.middleware");


exports.signup = (req, res) => {
  userMiddleware.register(req, res, jwt);  
};

exports.signin = (req, res) => {
  userMiddleware.logIn(req, res, jwt);    
};

exports.verifyUser = (req, res, next) => {
  userMiddleware.veryfication(req, res, next);    
};

exports.verifyReset = (req, res, next) => {
  userMiddleware.veryficationReset(req, res, next);    
};

exports.reset = (req,res) =>{
  userMiddleware.reseting(req, res);
}
