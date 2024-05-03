const express = require("express");
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cors = require('cors');

const app = express();

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
const Role = db.role;
db.sequelize.sync().then(() => {
  console.log('Database sequelized');
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

require('./app/routes/profile.routes')(app);
require('./app/routes/mainGame.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

