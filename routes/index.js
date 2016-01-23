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
        password: String,
        email: String,
        confirmed: String
    }
});

var User = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
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

router.post('/finishRegister',function(req, res, next) {
    res.render('finishRegister', { title: 'Complete Registration' });
});

router.post('/confirmAcc',function(req, res, next) {
    var getid=req.body.confirmcode;
    console.log(getid);
    var requis = { "_id": getid };
    User.findOne(requis, function (err, doc){
        doc.credentials.confirmed="1";
        doc.save();
        if (err) throw err;
});
    res.render('index', {title:'nDoto'});
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
    var validemail;
    var validpass;
    var validusername;
    var freeemail;
    
    var x = req.body.email;
    var p = req.body.password;
    var p1 = req.body.passwordagain;
    console.log(x);
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        res.render('index', {title: 'nDoto', err2: 'Invalid Email Address!'});
        return;
    } else {
    var validemail=1;
    }
    
    if (p1!=p){
    res.render('index', {title: 'nDoto', err2: 'Passwords do not match!'});
    return;
    } else {
        var validpass=1;
    }
    
    User.count({ 
    'credentials.email': x
    }, function(err, count) {
        if (err) throw err;
        console.log(count);
        if (count > 0) {
            res.render('index', {
                title: 'nDoto', 
                err2: 'Email is already in use. Try logging in!'
            });
        } else {
            var freeemail=1;
        }

    User.count({
        'credentials.username': gusername
    }, function(err, count) {
        if (err) throw err;
        console.log(count);
        if (count > 0) {
            res.render('index', {
                title: 'nDoto', 
                err2: 'Username is taken. Please try again'
            });
        } else {
            var validusername=1;
        }

        if (freeemail==1 && validemail==1 && validusername==1 && validpass==1){
            
            var bad = new User({
                credentials: {
                    username: gusername,
                    password: gpassword,
                    email: x,
                    confirmed: '0'
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
            
             server.send({
                text: 'Please enter this code into the appropriate box on the site in order to confirm your account on nDoto. Thanks!\n\nCode: '+bad.id,
                from: 'Register@nDoto.co:',
                to: x,
                cc: '',
                subject: 'Please confirm your account'
            }); 
            
            res.redirect('/regisComplete/' + gusername);

        }
    });
    });
});

router.post('/logSubmit', function(req, res, next) {
    var gusername = req.body.username;
    var gpassword = req.body.password;
    toString(gusername);
    toString(gpassword);
    console.log(gusername+gpassword);
    
  User.findOne({ 'credentials.username': gusername }, function(err, user) {
  if (err) throw err;
  // 'user' is the User object that was retrievd. If it exists, then it has a password.
  if (user) {
    // Do something with the password.
    // The password is stored in user.credentials.password
    var gottenpassword = user.credentials.password;
    if (gpassword==gottenpassword) {
        res.redirect('/bugreport');
    } else {
        res.render('index',{title: 'nDoto', logerr:'The password is incorrect!'});
    }
  } else {
    // Raise an error or return an error response
    res.render('index',{title: 'nDoto', logerr:'The username is incorrect!'});
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