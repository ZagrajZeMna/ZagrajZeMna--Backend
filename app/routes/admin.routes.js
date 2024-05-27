const { verifySignUp } = require("../middleware");
const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/admin/getUser", controller.getUser);
  app.get("/api/admin/getBannedUser", controller.getBannedUser);
  app.get("/api/admin/getNotBannedUser", controller.getNotBannedUser);
  app.put("/api/admin/banUser", controller.banUser);
  app.put("/api/admin/unbanUser", controller.unbanUser);
  app.post("/api/admin/getUserIfno", controller.getUserIfno);

  app.post("/api/admin/addNewGame", controller.addNewGame);
};