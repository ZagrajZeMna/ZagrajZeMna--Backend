const { authJwt } = require("../middleware");
const controller = require("../controllers/lobby.controller");
const authAcc = require("../middleware/authAcc");
const { Connection } = require("pg");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/lobby/show",controller.show);
  app.post("/api/lobby/add",[authJwt.verifyToken],controller.add);
  app.get("/api/lobby/data",controller.data);
  app.get("/api/lobby/gameinfo", controller.gameinfo);
};
  