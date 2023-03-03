const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create data / insert data
app.post('/api/transaction', (req, res) => {
    
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));