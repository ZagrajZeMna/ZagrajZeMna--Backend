const express = require('express')
const pool = require('./db')
const port = 3000


const app = express()
app.use(express.json())


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
        res.send('Hello, World!');
})
/*
app.get('/register', (req, res) => {
        res.send('This is the registration page.');
})
*/

app.post('/register', async (req, res) => {
        try {
          const { nick, email, password } = req.body;
          //Logika zapisu do bazy danych
          //wait pool.query('INSERT INTO users (nick, email, password) VALUES ($1, $2, $3)', [nick, email, password]);
      
          res.status(201).json({ message: 'Użytkownik zarejestrowany' });
        } catch (error) {
          res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji' });
        }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`))