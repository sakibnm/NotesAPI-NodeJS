import express from 'express';
import UserController from './user/UserController';
import AuthController from './auth/AuthController';
import NoteController from './notes/NoteController';

var app = express();

app.use('/users', UserController);
app.use('/api/auth', AuthController);
app.use('/api/note', NoteController);

export default app;