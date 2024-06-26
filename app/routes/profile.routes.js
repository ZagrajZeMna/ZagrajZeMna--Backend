const { verifySignUp } = require("../middleware");
const controller = require("../controllers/profile.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/profile/getUserDetails", [authJwt.verifyToken], controller.getUserDetails);
  app.post("/api/profile/postAvatarFile", [authJwt.verifyToken], controller.postAvatarFile);
  app.post("/api/profile/postUsername", [authJwt.verifyToken], controller.postUsername);
  app.post("/api/profile/changePassword", [authJwt.verifyToken], controller.changePassword);
  app.post("/api/profile/updateAbout", [authJwt.verifyToken], controller.updateAbout);
  app.post("/api/profile/updateCountry", [authJwt.verifyToken], controller.updateCountry);
  app.post("/api/profile/updateCity", [authJwt.verifyToken], controller.updateCity);
  app.post("/api/profile/updateContact", [authJwt.verifyToken], controller.updateContact);
  app.get("/api/profile/getAllLanguages", [authJwt.verifyToken], controller.getAllLanguages);
  app.post("/api/profile/setUserLanguage", [authJwt.verifyToken], controller.setUserLanguage);
  app.post("/api/profile/usersLobby",[authJwt.verifyToken],controller.usersLobby);
  app.post("/api/profile/usersGames",[authJwt.verifyToken],controller.usersGames);
  app.post("/api/profile/addGameToShelf",  [authJwt.verifyToken], controller.addGameToShelf);
  app.delete("/api/profile/removeGameFromShelf", [authJwt.verifyToken], controller.removeGameFromShelf);
  app.get("/api/profile/getUserStats", [authJwt.verifyToken], controller.getUserStats);
  app.get("/api/profile/getUserById", controller.getUserById);
  app.get("/api/profile/lastLobbies",[authJwt.verifyToken], controller.getLastLobbies );
};