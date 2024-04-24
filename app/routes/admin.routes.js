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
  app.post("/api/admin/addLanguage", [authJwt.verifyToken], controller.addLanguage);
  //app.delete("/api/admin/deleteLanguage", [authJwt.verifyToken], controller.deleteLanguage);
};