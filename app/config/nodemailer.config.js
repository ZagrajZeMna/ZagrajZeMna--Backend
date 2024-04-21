const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.key.user;
const pass = config.key.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Weryfikacja e-mail: Zagraj ze mną",
      html: `<h1>Potwierdzenie e-mail</h1>
          <h2>Cześć ${name}</h2>
          <p>Dziękujemy za rejestrację na naszej platformie. Proszę potwierdź swój e-mail klikająć poniższy link</p>
          <a href=http://localhost:4001/api/auth/confirm/${confirmationCode}> Potwierdź email</a>
          </div>`,
    }).catch(err => console.log(err));
  };

  module.exports.sendResetEmail = (email, confirmationCode)=> {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Resetowanie hasła: Zagraj ze mną",
      html: `<h1>Resetowanie hasła</h1>
          <p>Aby dokończyć resetowanie hasła kliknij w link i zaloguj się</p>
          <a href=http://localhost:4001/api/auth/reset/${confirmationCode}>Zresetuj hasło</a>
          </div>`,
    }).catch(err => console.log(err));
  }; 