const { verifySignUp } = require("../middleware");
const controller = require("../controllers/mainGame.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/mainGame/getGame", controller.getGame);
  app.get("/api/mainGame/getGamePagination", controller.getgamePagination);
};