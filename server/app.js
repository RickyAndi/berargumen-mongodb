var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var passport = require('./passport');
var app = express();

// require route
var authRoute = require('./routes/auth');
var indexRoute = require('./routes/index');
var boardRoute = require('./routes/my-board');
var apiRoute = require('./routes/api');
var profileRoute = require('./routes/profile');

// set plugins
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// route
indexRoute(app);
authRoute(app);
boardRoute(app);
apiRoute(app);
profileRoute(app);

module.exports = app;
