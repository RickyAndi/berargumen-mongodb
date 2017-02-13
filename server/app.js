var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var passport = require('./passport');
var expressValidator = require('express-validator');
var app = express();

// set plugins
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({ secret: '763782hwewhjsuweuwueiuiew78726786278uiweghuwkejksdjsdgjhdfgdfgjhdgfhjdgfhdjfghdfhdfhjdhfkjdhkfuey776767778', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
