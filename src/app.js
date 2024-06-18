const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const voiceRoutes = require('./routes/voiceRoutes');
const smsRoutes = require('./routes/smsRoutes');
const callbackRoutes = require('./routes/callbackRoutes');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: 'auto',
        maxAge: 3600000
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/voice', voiceRoutes);
app.use('/sms', smsRoutes);
app.use('/callback', callbackRoutes);

app.get('/', (req, res) => {
  res.send('AI Trivia Game is running');
});

module.exports = app;
