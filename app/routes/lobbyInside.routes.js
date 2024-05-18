const { verifySignUp } = require("../middleware");
const controller = require("../controllers/lobbyInside.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/lobbyInside/getUserList", controller.getUserList);
  app.get("/api/lobbyInside/getOwnerLobbyData", controller.getOwnerLobbyData);
  app.get("/api/lobbyInside/getMessageList", controller.getMessageList);
  app.post("/api/lobbyInside/addUser", controller.addUser);
  app.post("/api/lobbyInside/addReview", controller.addRewiev);
  app.post("/api/lobbyInside/addMessage", controller.addMessage);
  app.delete("/api/lobbyInside/deleteUser", controller.deleteUser);
  app.delete("/api/lobbyInside/deleteLobby", controller.deleteLobby);
};