const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
const Languages = db.Languages;
const UserReview = db.UserReview;
const Shelf = db.Shelf;
const UIL = db.UserInLobby;

const multer = require('multer');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Konfiguracja Cloudinary
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dcqhaa1ez',
  api_key: '334823839869595',
  api_secret: 'jhBEa7mL2z_mnlbCsEAEYklusbI'
});

const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/dcqhaa1ez/image/upload/v1716977307/default.png';

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

exports.fetchUserDetails = async (req, res, userId) => {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['email', 'username', 'about', 'avatar', 'country', 'city', 'contact', 'ID_LANGUAGE']
      });
  
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      
      const reviews = await UserReview.findAll({
        where: { ID_ABOUT: userId },
        attributes: ['stars']
    });


    let averageRating = null;
        if (reviews.length > 0) {
            const totalStars = reviews.reduce((total, review) => total + review.stars, 0);
            averageRating = totalStars / reviews.length;
        }


      // Konwersja ID_LANGUAGE na nazwę języka
      const language = await Languages.findByPk(user.ID_LANGUAGE);
      const userWithLanguageAndRating = {
        ...user.get({ plain: true }),
        language: language ? language.LANGUAGE : null,
        averageRating
      };
  
      return res.status(200).send(userWithLanguageAndRating);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

exports.fetchUserInfo = async (req, res, userId) => {  
  try {
      const user = await User.findByPk(userId, {
          attributes: ['ID_USER', 'email', 'username', 'about', 'country', 'city', 'contact', 'isAdmin']
      });

      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      res.status(200).send(user);
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};

exports.postChangePassword = async (req, res, userId, oldPassword, newPassword, confirmPassword) => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).send({ message: "All fields are required." });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: "New passwords do not match." });
    }
  
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Old password is incorrect." });
      }
  
      if (await bcrypt.compare(newPassword, user.password)) {
        return res.status(400).send({ message: "New password must be different from the old password." });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await user.update({ password: hashedPassword });
  
      return res.status(200).send({ message: "Password successfully changed." });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

exports.updateUsername = async (req, res, userId, newUsername) => {
    if (!newUsername) {
      return res.status(400).send({ message: "Username cannot be empty." });
    }
  
    try {
      const userWithSameUsername = await User.findOne({ where: { username: newUsername } });
      if (userWithSameUsername) {
        return res.status(409).send({ message: "This username is already taken." });
      }
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ username: newUsername });
  
      return res.status(200).send({
        message: "Username has been successfully updated.",
        username: newUsername,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

exports.postAbout = async (req, res, userId, about) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ about });
  
      return res.status(200).send({
        message: "About information updated successfully.",
        about: about,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating about information: " + error.message });
    }
};

exports.postCountry = async (req, res, userId, country) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ country });
  
      return res.status(200).send({
        message: "Country updated successfully.",
        country: country,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating country: " + error.message });
    }
};
  
exports.postCity = async (req, res, userId, city) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ city });
  
      return res.status(200).send({
        message: "City updated successfully.",
        city: city,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating city: " + error.message });
    }
};
  
exports.postContact = async (req, res, userId, contact) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      await user.update({ contact });
  
      return res.status(200).send({
        message: "Contact information updated successfully.",
        contact: contact,
      });
    } catch (error) {
      return res.status(500).send({ message: "Error updating contact information: " + error.message });
    }
};

exports.updateAvatarFile = (req, res) => {
    // Konfiguracja przechowywania plików multer
  const storage = multer.memoryStorage();
  
  // Filtr plików multer, który akceptuje tylko określone typy obrazów
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
    }
  };

  // Konfiguracja multer
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
  }).single('avatar');

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Please upload an avatar." });
    }

    try {
      const userId = req.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Przesyłanie obrazu do Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }).end(req.file.buffer);
      });

      // Sprawdzenie, czy obecny avatar to domyślny URL
      if (user.avatar && user.avatar !== DEFAULT_AVATAR_URL) {
        const publicId = user.avatar.match(/\/([^\/]+)\.[^\/]+$/)[1];
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            console.error('Failed to delete old avatar from Cloudinary:', error);
          } else {
            console.log('Old avatar successfully deleted from Cloudinary');
          }
        });
      }

      // Zaktualizuj użytkownika z nowym URL awatara
      const updatedUser = await user.update({ avatar: result.secure_url });

      res.status(200).send({
        message: "Avatar successfully uploaded.",
        avatar: result.secure_url
      });

    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
};

exports.updateUserLanguage = async (userId, languageId, res) => {
    try {
      // Sprawdź, czy wybrany język istnieje w bazie danych
      const languageExists = await Languages.findByPk(languageId);
      if (!languageExists) {
        return res.status(404).send({ message: "Language not found." });
      }
  
      // Znajdź i zaktualizuj użytkownika
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ ID_LANGUAGE: languageId });
        return res.status(200).send({ message: "User language updated successfully." });
      } else {
        return res.status(404).send({ message: "User not found." });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error updating user language: " + error.message });
    }
};

exports.banUsers = async (req, res, userId) => {  
  try {
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      if (user.isBanned) {
          return res.status(400).send({ message: "User is already banned." });
      }

      user.isBanned = true;
      await user.save();

      res.status(200).send({ message: "User has been banned." });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};

exports.unbanUsers = async (req, res, userId) => {  
  try {
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      if (!user.isBanned) {
          return res.status(400).send({ message: "User is not banned." });
      }

      user.isBanned = false;
      await user.save();

      res.status(200).send({ message: "User has been unbanned." });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    // Paginacja z parametrów zapytania
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const size = req.query.size ? parseInt(req.query.size) : 10;
    const { limit, offset } = getPagination(page, size);

    // Pobieranie wartości isBanned z parametrów zapytania
    let isBanned = req.query.isBanned;
    if (isBanned === 'true') {
      isBanned = true;
    } else if (isBanned === 'false') {
      isBanned = false;
    } else {
      isBanned = null;
    }

    const whereClause = isBanned !== null ? { isBanned } : {};

    // Liczenie wszystkich użytkowników
    const totalUsers = await User.count({ where: whereClause });

    // Pobieranie użytkowników z limitem
    const users = await User.findAll({
      attributes: ['ID_USER', 'email', 'username', 'avatar', 'isBanned'],
      where: whereClause,
      order: [['username', 'ASC']],
      limit,
      offset
    });

    if (users.length === 0) {
      return res.status(404).send({ message: "Users not found!" });
    }

    const numberOfPages = Math.ceil(totalUsers / limit);

    res.status(200).send({
      users,
      totalPages: numberOfPages
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.sendMessage = async (req, res, user_id, name, message) => {
try{
    //Sprawdzanie czy gracz wysyłający prośbę istnieje
    const ifUserExist = await User.findOne({where: {ID_USER: Number(user_id)}, attributes: ["username", "email"]});
    
    if(!ifUserExist){
        return res.status(403).send({message:"There is no such user. Id of user is incorrect!"});
    }

    const regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

    if(!(regex.test(ifUserExist.email))){
        return res.status(404).send({message:"Email of user is incorect!"});
    }

    nodemailer.sendQuestion(
        name,
        message+"\n\n"+ifUserExist.username+"\n"+ifUserExist.email
    );

      res.status(200).send({message:"Email was send!"});

}
catch(error){
    res.status(500).send({message: "Error during adding review : "+error.message});
}     

};

exports.register = async (req, res, jwt) => {
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

exports.logIn = async (req, res, jwt) => {
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
        response.admin = admin;
      }

      res.send(response);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.veryfication = async (req, res, next) => {
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

exports.veryficationReset = async (req, res, next) => {
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

exports.reseting = async (req, res) => {
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

};

exports.getStatus = async (req, res, userId) => {
  try {
    // Liczenie gier na półce użytkownika
    const gamesCount = await Shelf.count({
        where: { ID_USER: userId }
    });

    // Liczenie lobby, do których użytkownik jest przypisany
    const lobbiesCount = await UIL.count({
        where: { ID_USER: userId }
    });

    res.status(200).send({
        gamesOnShelf: gamesCount,
        lobbiesJoined: lobbiesCount
    });
} catch (error) {
    res.status(500).send({ message: "Error retrieving user stats: " + error.message });
}

};