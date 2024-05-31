const { verifySignUp } = require("../middleware");
const controller = require("../controllers/lobbyInside.controller");
const { authJwt } = require("../middleware");
const chat = require("../middleware/chat");
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
  app.post("/api/lobbyInside/addReview", controller.addRewiev);
  app.post("/api/lobbyInside/addMessage", controller.addMessage);

  app.put("/api/lobbyInside/updateLobbyStillLooking", controller.updateLobbyStillLooking);
  app.put("/api/lobbyInside/updateLobbyDescription", controller.updateLobbyDescription);
  app.put("/api/lobbyInside/changeLobbyOwner", controller.changeLobbyOwner);

  app.delete("/api/lobbyInside/deleteUser", controller.deleteUser);
  app.delete("/api/lobbyInside/deleteLobby", controller.deleteLobby);

  app.post("/api/lobbyInside/latest100messages", controller.latest100messages);
};