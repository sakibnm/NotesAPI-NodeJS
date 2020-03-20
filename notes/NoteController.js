var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Note = require('./Note');
var User = require('../user/User');
var VerifyToken = require('../auth/VerifyToken');

var config = require('../config');
var jwt = require('jsonwebtoken');

router.get('/get', VerifyToken, (req, res, next)=>{
    var token = req.headers['x-access-token'];
    var msgID = req.body.id;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        User.findById(req.userId, {password:0}, function (err, user) {
            if (err) return res.status(500).send({ register: false, message: "There was a problem finding the user."});
            if (!user) return res.status(404).send({ login: false, message:"No user found."});
            //   next(msgID, req.userId);
            // next(getnote);
            Note.findById(msgID, (err, note)=>{
                if(err) return res.status(500).send({ findnote: false, message:"There was a problem finding the note."});
                if(!note) return res.status(404).send({ findnote: false, message:"No note found."});
                if (note.userId == req.userId){
                    res.status(200).send({ getnote: true, note: note});
                }else{
                    res.status(405).send({ getnote: false, message:"This is not your note."});
                }
            });
             
        });
    });
});

router.get('/getall', VerifyToken, (req, res, next)=>{
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        User.findById(req.userId, {password:0}, function (err, user) {
            if (err) return res.status(500).send({ getall: false, message:"There was a problem finding the user."});
            if (!user) return res.status(404).send({ getall: false, message: "No user found."});
            //   next(msgID, req.userId);
            // next(getnote);
            Note.find({userId: req.userId}, (err, notes)=>{
                if(err) return res.status(500).send({ getall: false, message:"There was a problem finding the note."});
                if(!notes) return res.status(404).send({ getall: false, message:"No note found."});
                
                // res.status(200).send("{"+
                //     "\"notes\": "+notes
                //     +"}");
                res.status(200).send({notes: notes});
            });
             
        });
    });
});

// router.use((getnote, req, res, next)=>{
//     Note.findById(req.body.id, (err, note)=>{
//         if(err) return res.status(500).send("There was a problem finding the note.");
//         if(!note) return res.status(404).send("No note found.");
//         if (note.userId == req.userId){
//             res.status(200).send(note);
//         }else{
//             res.status(405).send("This is not your note.");
//         }
//     });
// });

router.post('/post', VerifyToken, (req, res, next)=>{
    var token = req.headers['x-access-token'];
    // console.log("Text: "+req.body.text);
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        User.findById(req.userId, {password:0}, function (err, user) {
          if (err) return res.status(500).send({ post: false, message: "There was a problem finding the user."});
          if (!user) return res.status(404).send({ post: false, message:"No user found."});
          if (req.body.text == "") return res.status(406).send({ post: false, message:"Text empty."});
            //    next(setnote);
           Note.create({
            userId: req.userId,
            text: req.body.text
            },
            (err, note)=>{
                if (err) return res.status(500).send({ post: false, message: "There was a problem posting."});
                res.status(200).send({posted: true, note: note});
            });   
        
        });
    });
});

router.post('/delete', VerifyToken, (req, res, next)=>{
    var token = req.headers['x-access-token'];
    var msgID = req.body.id;
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.findById(req.userId, {password:0}, function (err, user) {
            if (err) return res.status(500).send({ register: false, message: "There was a problem finding the user."});
            if (!user) return res.status(404).send({ login: false, message:"No user found."});
            //   next(msgID, req.userId);
            // next(getnote);
            Note.findById(msgID, (err, note)=>{
                if(err) return res.status(500).send({ findnote: false, message:"There was a problem finding the note."});
                if(!note) return res.status(404).send({ findnote: false, message:"No note found."});
                if (note.userId == req.userId){
                    Note.findByIdAndRemove(msgID, function (err, note) {
                        if (err) return res.status(500).send("There was a problem deleting the note.");
                        res.status(200).send({ delete: true, message: "Note: "+ msgID +" was deleted."});
                    });
                }else{
                    res.status(405).send({ getnote: false, message:"This is not your note."});
                }
            });

        });
    });
});

// router.use((setnote, req, res, next)=>{
//     Note.create({
//         userId: req.userId,
//         text: req.body.text
//     },
//     (err, note)=>{
//     if (err) return res.status(500).send("There was a problem posting.");
//     res.status(200).send({posted: true, note: note});
//     });
// });

module.exports = router;
