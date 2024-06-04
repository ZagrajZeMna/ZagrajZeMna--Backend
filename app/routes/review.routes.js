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
  
  app.post("/api/review/addReview", controller.addReview);
  app.post("/api/review/addGameReq", controller.addGameReq);
  app.post("/api/review/addGameReq", controller.addGameReq);
  app.post("/api/review/addGameReq", controller.addGameReq);
  
};