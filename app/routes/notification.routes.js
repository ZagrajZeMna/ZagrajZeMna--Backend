const { authJwt } = require("../middleware");
const controller = require("../controllers/notification.controller");
const authAcc = require("../middleware/authAcc");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/noti/show",[authJwt.verifyToken],controller.show);
  app.get("/api/noti/showinfo",[authJwt.verifyToken],controller.showinfo);
  app.post("/api/noti/delete",controller.delete);
};
