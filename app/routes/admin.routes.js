const controller = require("../controllers/admin.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
    
    app.post("/api/mainGame/addNewGame", controller.addNewGame);
    app.delete("/api/mainGame/deleteGame/:id", controller.deleteGame);
    app.put("/api/admin/banUser", controller.banUser); 
    app.put("/api/admin/unbanUser", controller.unbanUser); 
  };