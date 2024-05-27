const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const User = require('./models/User');
const Contact = require('./models/Contact');

dotenv.config();

const app = express();
app.use(bodyParser.json());

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => {
        console.log('Error connecting to the database:', err);
    });

// Commenting out the sync method to avoid creating tables every time
/*
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.log('Error syncing database:', err);
    });
*/

app.use('/auth', require('./routes/auth'));
app.use('/contacts', require('./routes/contacts'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
});

module.exports.handler = serverless(app);
