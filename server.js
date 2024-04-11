const express = require("express");
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();


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
  res.json({ message: "Strona Główna" });
});

app.get("/login", (req, res) => {
  res.json({ message: "Zaloguj się!" });
});

//Logging system routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

