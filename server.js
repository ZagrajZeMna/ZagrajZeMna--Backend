const express = require("express");
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const { authJwt } = require("./app/middleware");
const notifications = require("./app/middleware/notification");

var corsOptions = {
  origin: ["http://localhost:4000", "http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// database
const db = require("./app/models");

db.sequelize.sync().then(() => {
  console.log('Database sequelized');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

var ID,token;
app.post("/api/lobby/join", (req, res) => {
  authJwt.verifyTokenNoti(req)
  ID = req.userId;
  token = req.token;
});

io.on("connection", (socket) => {

  socket.on("joinRoom", async (data) => {   
    try{
      let result = await notifications.join(data,ID,token);
      if(result != null){
        socket.broadcast.emit(result[0],result[1],result[2]);
      }
    }
    catch(err){
      console.log(err);
    }
  });
  
  socket.on("accepted", async (ID,Desc,IDLobby) => {
    try{
      let result = await notifications.accept(ID,Desc,IDLobby);
      if(result != null){
        socket.broadcast.emit(result[0],result[1],result[2]);
      }
    }
    catch(err){
      console.log(err);
    }
  });

  socket.on("declined", async (ID,Desc,IDLobby) => {
    try{
      let result = await notifications.decline(ID,Desc,IDLobby);
      if(result != null){
        socket.broadcast.emit(result[0],result[1],result[2]);
      }
    }
    catch(err){
      console.log(err);
    }
  });
});

// main route
app.get("/", (req, res) => {
  res.json({ message: "/ (Strona główna)" });
});

app.get("/login", (req, res) => {
  res.redirect("http://localhost:5173/login");
  //res.json("/login (Logowanie)")
});

app.get("/register", (req, res) => {
  res.redirect("http://localhost:5173/registration");
  //res.json("/register (Rejestracja)")
});

app.get("/restartpassword", (req, res) => {
  res.redirect("http://localhost:5173/login");
  //res.json("/restartpassword (Reset hasła)")
});
//Logging system routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/lobby.routes')(app);
require('./app/routes/profile.routes')(app);
require('./app/routes/mainGame.routes')(app);
require('./app/routes/admin.routes')(app);
require('./app/routes/notification.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

