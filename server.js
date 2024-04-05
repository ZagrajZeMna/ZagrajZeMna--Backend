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



app.listen(port, () => console.log(`Server has started on port: ${port}`))