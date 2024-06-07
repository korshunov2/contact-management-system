const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const serverless = require('serverless-http'); // Importing serverless-http
const contactsRoute = require('./routes/contacts');
const authRoute = require('./routes/auth');
const aiRoute = require('./routes/ai'); // Importing ai.js

const app = express();
const port = process.env.PORT || 3000;

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/contacts', contactsRoute);
app.use('/auth', authRoute);
app.use('/ai', aiRoute); // Using ai.js

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    if (process.env.IS_OFFLINE) { // Check if running locally
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    }
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export the app and the handler for serverless
module.exports = app;
module.exports.handler = serverless(app);

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

