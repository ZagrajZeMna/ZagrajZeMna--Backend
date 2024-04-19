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
  
  app.post("/api/profile/postAvatarlink", [authJwt.verifyToken], controller.postAvatarLink);
  app.post("/api/profile/postAvatarFile", [authJwt.verifyToken], controller.postAvatarFile);
  app.post("/api/profile/postUsername", [authJwt.verifyToken], controller.postUsername);
  app.post("/api/profile/changePassword", [authJwt.verifyToken], controller.changePassword);
};