const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const authAcc = require("../middleware/authAcc");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signup
  );

  app.post("/api/auth/signin",[authAcc.verifyBan], controller.signin);

  app.post("/api/auth/remember",controller.reset);

  app.get("/api/auth/confirm/:confirmationCode", controller.verifyUser,(req,res)=>{
    res.redirect("/login")
  })
  app.get("/api/auth/reset/:confirmationCode", controller.verifyReset,(req,res)=>{
    res.redirect("/login")
  });
};
