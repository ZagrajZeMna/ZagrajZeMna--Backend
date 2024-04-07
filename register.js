/*
const { password } = require("pg/lib/defaults");

//DataBase for future
const { Pool } = require('pg');
 
const pool = new Pool({
  user: 'username',
  password: 'password',
  email: 'email',
  port: 5432,
});



let osoba = {
    nick: "Nick",
    email: "997@gmail.com",
    password: "1234",
};


function validateEmail(email) {

    //regex to check if email is correct
    const regex = /^[^\.@]{3,}@[^\.@]+\.[a-zA-Z]{2,4}$/;
 
    // Testing e-mail
    if (regex.test(email)) {
        return "Adres e-mail jest poprawny.";
    } else {
        return "Niepoprawny adres e-mail.";
    }
}


function validatePassword(password){

    //check if password is too short
    if(password.length < 6){
        return {isValid: false, message: "Password too short."}
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    //check if password has upper case
    if(!hasUpper){
        return { isValid: false, message: "Password have to have Upper case!"};
    }

    //check if password has lower case
    if(!hasLower){
        return { isValid: false, message: "Password have to have Lower case!"};
    }

    //check if password has digit
    if(!hasDigit){
        return { isValid: false, message: "Password have to have digit!"};
    }

    return { isValid: true, message: "Password is correct." };

};

function validateNickname(nickname){

    //check if nickname is correct
    const regex = /^[a-zA-Z0-9]{4,}$/;
 
    if (regex.test(nickname)) {
        return { isValid: true, message: "Nickname is correct!"};
    } else {
        return { isValid: false, message: "Nickname must have at least 4 sign and should have only numbers and letters!"};
    }

}

async function checkEmailUnq(email) {
    try {
      //get a user with the same email form dataBase
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
      //check if there is the same mail in dataBase
      if (result.rows.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking email uniqueness', error);
      throw error;
    }
}

async function checkNickUnq(nickname) {
    try {
      //get a user with the same nick form dataBase
      const result = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        
      //check if there is the same nick in dataBase
      if (result.rows.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking nickname uniqueness', error);
      throw error;
    }
}

function matchpassword(password, repeat){
    if(password==repeat)
        return { isValid: true, message: "Passwords are identical." };
    else 
        return { isValid: false, message: "Password aren't identical." };
}



async function checkdata(){

    //get information from frontend

    if(matchpassword(password, repeat) && checkNickUnq(nickname) && checkEmailUnq(email) &&
    validateNickname(nickname) && validatePassword(password) && validateEmail(email))
        ;//send information to data base
}
*/


