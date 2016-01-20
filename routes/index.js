var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();
var email = require('emailjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    credentials: {
        username: String,
        password: String
    }
});

var User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dev', {
        title: 'nDoto'
    });
});

/* GET credits page */
router.get('/credits', function(req, res, next) {
    res.render('credits', {
        title: 'Credits'
    });
});

router.get('/dev', function(req, res, next) {
    res.render('dev', {
        title: 'Error'
    });
});

/*mail*/
router.post('/sendMail', function(req, res, next) {
    var texta = req.body.bug;
    var gnameoruser = req.body.nameoruser;
    var gbugemail = req.body.bugemail;
    var server = email.server.connect({
        user: 'ndotodrew@gmail.com',
        password: 'welcometor4ge!',
        host: 'smtp.gmail.com',
        ssl: true
    });

    server.send({
        text: texta.toString(),
        from: gbugemail + " - nDoto.co:",
        to: 'Drew Tarnowski <ndotodrew@gmail.com>',
        cc: '',
        subject: 'A Bug Report / Feedback from nDoto.co has been submitted by ' + gnameoruser
    }, function(err, message) {
        console.log(err || message);
    });
})

/* GET RegisterSubmit*/
// document is not defined
// you have to use POST

router.post('/regsubmit', function(req, res, next) {

    var gusername = req.body.username;
    var gpassword = req.body.password;

    User.count({
        'credentials.username': gusername
    }, function(err, count) {
        if (err) throw err;
        console.log(count);
        if (count > 0) {
            res.render('login', {
                err: 'name in use!'
            });
        } else {

            var bad = new User({
                credentials: {
                    username: gusername,
                    password: gpassword
                }
            });

            console.log(bad.credentials.username);

            bad.save();

            var server = email.server.connect({
                user: 'ndotodrew@gmail.com',
                password: 'welcometor4ge!',
                host: 'smtp.gmail.com',
                ssl: true
            });

            server.send({
                text: 'A user has registered on nDoto with login:\nUsername: ' + gusername + '\nPassword: ' + gpassword,
                from: 'Register@nDoto.co:',
                to: 'Drew Tarnowski <ndotodrew@gmail.com>',
                cc: '',
                subject: 'A user has registered on nDoto!'
            });

            res.redirect('/regisComplete/' + gusername);
        }
    });
});

router.post('/logSubmit', function(req, res, next) {
    var gusername = req.body.username;
    var gpassword = req.body.password;
    toString(gusername);
    toString(gpassword);
    
  User.findOne({ 'credentials.username': gusername }, function(err, user) {
  if (err) throw err;
  // 'user' is the User object that was retrievd. If it exists, then it has a password.
  if (user) {
    // Do something with the password.
    // The password is stored in user.credentials.password
    var gottenpassword = user.credentials.password;
    if (gpassword==gottenpassword) {
        res.redirect('/');
    } else {
        res.render('login',{logerr:'the password is wrong!'});
    }
  } else {
    // Raise an error or return an error response
    res.render('login',{logerr:'user does not exist!'});
  }
});

});

/* GET regisdone page */
router.get('/regisComplete/:username', function(req, res, next) {
    res.render('regisComplete', {
        title: 'Registration Complete',
        username: req.params.username
    });
});

/* GET login/register page */
router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.get('/bugreport', function(req, res, next) {
    res.render('bugreport', {
        title: 'Report a Bug / Send Feedback'
    });
});

router.get('/addLike', function(req, res, next) {
    fs.readFile('likeNumber.txt', 'utf-8', function(err, read) {
        if (err) throw err;
        fs.writeFile('likeNumber.txt', parseInt(read) + 1, function(err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });
    res.redirect('/');
});

router.get('/resetAll', function(req, res, next) {
    fs.writeFile('likeNumber.txt', 0, function(err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
    res.redirect('/');
});

router.get('/removeLike', function(req, res, next) {
    fs.readFile('likeNumber.txt', 'utf-8', function(err, read) {
        if (err) throw err;
        fs.writeFile('likeNumber.txt', parseInt(read) - 1, function(err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
    });
    res.redirect('/');
});

module.exports = router;