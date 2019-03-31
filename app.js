var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

var NoteController = require('./notes/NoteController');
app.use('/api/note', NoteController);

module.exports = app;