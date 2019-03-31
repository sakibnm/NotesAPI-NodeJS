var mongoose = require('mongoose');
var NoteSchema = new mongoose.Schema({
    userId: String,
    text: String
});

mongoose.model('Note', NoteSchema);
module.exports = mongoose.model('Note');