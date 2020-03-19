import {Schema, model} from 'mongoose';

var UserSchema = Schema({  
  name: String,
  email: String,
  password: String
});
model('User', UserSchema);

module.exports = model('User');