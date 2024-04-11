const express = require('express');
const pool = require('./db');
const port = 3000;
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');


const initializePassport = require("./passportConfig");

initializePassport(passport);

const app = express()
app.use(express.json())


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

//middleware
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

//sesja logowania
app.use(
        session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
        })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get('/', (req, res) => {
        res.send('Hello, World!');
});
    

app.listen(port, () => console.log(`Server has started on port: ${port}`))