const db = require("../models");
const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const admin = require("../middleware/authAcc")

const User = db.User;

const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const token = jwt.sign({email: req.body.email}, config.key.secret)
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: token,
    ID_LANGUAGE: 1,
    avatar: "https://res.cloudinary.com/dcqhaa1ez/image/upload/v1716977307/default.png"
  })
  .then((user)=>{
    console.log("----------------MAIL SEND-----------------")
    nodemailer.sendConfirmationEmail(
      user.username,
      user.email,
      user.confirmationCode
    );
    res.json({ message: "User registered successfully!" });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
  
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      if (user.status === "Created") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
      if (user.status === "Pending") {
        return res.status(401).send({
          message: "Please reset your password using link send via email!",
        });
      }
      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }
      const token = jwt.sign({ID_USER: user.ID_USER},config.key.secret, {
        algorithm: "HS256",
        expiresIn: 7200, 
    });
      const admin = jwt.sign({ ADMIN: user.isAdmin },config.key.admin,
      {
          expiresIn: 7200, 
      });
      
      user.confirmationCode = token;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });

      const response = {
        username: user.username,
        token: token
      };

      if (user.isAdmin === true) {
        response = admin;
      }

      res.send(response);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.verifyUser = (req, res, next) => {
  User.findOne({
    where: {
      confirmationCode: req.params.confirmationCode,
    }
  })
  .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
    next();
};

exports.verifyReset = (req, res, next) => {
  User.findOne({
    where: {
      confirmationCode: req.params.confirmationCode,
    }
  })
  .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
      return new Promise((resolve) => {
          resolve(req.status);
      });
    })
    .catch((e) => console.log("error", e));
    next();
};


exports.reset = (req,res) =>{
  User.findOne({
    where: {
      email: req.body.email,     
    }
  }).then(async user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Pending";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
      nodemailer.sendResetEmail(
        user.email,
        user.confirmationCode
      );
      user.password = bcrypt.hashSync(req.body.password, 8);
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
      res.json({ message: "Restart link send: please check your email" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}
