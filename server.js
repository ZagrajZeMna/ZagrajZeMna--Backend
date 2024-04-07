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
        res.render('index');
})

app.get('/users/register',checkAuthenticated,(req,res)=>{
        res.render("register");
})

app.get("/users/login",checkAuthenticated,(req,res)=>{
        console.log(req.session.flash.error);
        res.render("login");
})

app.get("/users/dashboard",checkNotAuthenticated,(req,res)=>{
        res.render("dashboard",{user: req.user.name});
})

app.get('/users/logout', (req, res, next)=> {
        req.logout((err)=> {
          if (err) { return next(err); }
          res.render('index',{meesage: "Wylogowano"});
   });
});
app.post("/users/register",(req,res)=>{
        let {name,email,password,password2} = req.body;
        console.log({
                name,
                email,
                password,
                password2,
        })
        let errors = [];
        if(!name,!email,!password,!password2)
             errors.push({message: "Proszę wypełnić wszystkie pola"})   
        if(password.length < 6)
                errors.push({message: "Hasło musi być dłuższe niż 6 znaków"})
        if(password != password2)
                errors.push({message: "Hasła nie są takie same"});
        if(errors.length > 0)
                res.render('register',{errors});
        else{
                //Form validation passed
                pool.query(
                        `SELECT * FROM users WHERE email = $1`, [email], (err,results)=>{
                                if(err)
                                        throw err;   
                                console.log(results.rows);

                                if(results.rows.length > 0){
                                        errors.push({message: "Podany adres email jest już przypisany do konta"});
                                        res.render('register',{errors});
                                }
                                //rejestracja w bazie danych
                                else{
                                        pool.query(
                                                `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,password`,[name,email,password],(err,results)=>{
                                                if(err)
                                                        throw err;
                                                console.log(results.rows);
                                                req.flash('success_msg',"Rejestracja zakończona")
                                                res.redirect('/users/login');
                                                }
                                        );
                                }

                        }
                )
        }
})

app.post(
        "/users/login",
        passport.authenticate("local", {
          successRedirect: "/users/dashboard",
          failureRedirect: "/users/login",
          failureFlash: true
        })
      );

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(port, () => console.log(`Server has started on port: ${port}`))