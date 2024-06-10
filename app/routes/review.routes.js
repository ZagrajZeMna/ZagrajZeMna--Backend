const { verifySignUp } = require("../middleware");
const controller = require("../controllers/review.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post("/api/review/addReview", [authJwt.verifyToken],controller.addReview);
  app.post("/api/review/addGameReq",[authJwt.verifyToken], controller.addGameReq);
  app.post("/api/review/reportUser", [authJwt.verifyToken],controller.reportUser);
  app.post("/api/review/sendMessage", [authJwt.verifyToken],controller.sendMessage);
  
  app.get("/api/review/getReportUser", controller.getReportUser);
  app.get("/api/review/getRequestGame", controller.getRequestGame);
  
};