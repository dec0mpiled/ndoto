var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();
var email = require('emailjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('dev', {title: 'nDoto'});
});

/* GET credits page */
router.get('/credits', function(req, res, next) {
  res.render('credits', { title: 'Credits' });
});

router.get('/dev', function(req, res, next) {
  res.render('dev', { title: 'Error' });
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
  from: gbugemail+" - nDoto.co:",
  to: 'Drew Tarnowski <ndotodrew@gmail.com>',
  cc: '',
  subject: 'A Bug Report / Feedback from nDoto.co has been submitted by '+gnameoruser
}, function (err, message) {
  console.log(err || message);
});
})

/* GET RegisterSubmit*/
// document is not defined
// you have to use POST

router.post('/regsubmit', function(req, res, next) {

var userSchema = new Schema({
  credentials: {
    username: String,
    password: String
  }
});

var User = mongoose.model('User', userSchema);
  
   var gusername = req.body.username;
   var gpassword = req.body.password;

User.count({'credentials.username':gusername}, function (err, count){ 
  if (err) throw err;
  console.log(count);
    if(count>0){
        res.render('login', {err: 'name in use!'});
    }
    
     else {
       
         var bad = new User({
           credentials: { username: gusername, password: gpassword }
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
  text: 'A user has registered on nDoto with login:\nUsername: '+gusername+'\nPassword: '+gpassword,
  from: 'Register@nDoto.co:',
  to: 'Drew Tarnowski <ndotodrew@gmail.com>',
  cc: '',
  subject: 'A user has registered on nDoto!'
});
     
     res.redirect('/regisComplete/'+gusername);
     }
    });
});

router.post('/listUsers', function(req, res, next) {
  var gets;
    fs.readFile('registerednames.csv', 'utf-8', function(err, gets) {
        if (err) throw err;
        res.render('adminpriv', {listed: gets, title: 'Admin Console' });
    });
});


router.post('/deleteUsers',function(req, res, next) {
    fs.writeFile('users.csv','', function(err) {
        if (err) throw err;
        console.log("Deleted users.csv");
    })
        fs.writeFile('registerednames.csv','', function(err) {
        if (err) throw err;
        console.log("Deleted registerednames.csv");
    })
    res.render('adminpriv', { title: 'Admin Console' });
})

router.post('/logSubmit', function(req, res, next) {
  var gusername
  var gpassword
    gusername=req.body.username;
    gpassword=req.body.password;
    
    fs.readFile('users.csv', 'utf-8', function (err, readlog) {
    if (err) throw err;
    var newtext = readlog.toString();
    var buscarL = newtext.search(gusername);
    if (buscarL>-1) {
      var test = '%'+gusername+'%: {'+ gusername + ','
      var firsthalf = newtext.indexOf('%'+gusername+'%: {'+ gusername + ',')
      var secondhalf = newtext.indexOf('}%' + gusername + '%')
      var checkpass = newtext.slice(firsthalf+test.length,secondhalf)
      console.log(checkpass);
    }
})
});

/* GET regisdone page */
router.get('/regisComplete/:username', function(req, res, next) {
  res.render('regisComplete', { title: 'Registration Complete', username: req.params.username });
});

/* GET login/register page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/bugreport', function(req, res, next) {
  res.render('bugreport', { title: 'Report a Bug / Send Feedback' });
});

router.get('/admin@:key', function(req, res, next) {
  if (req.params.key=='tarnowski27' || req.params.key=='owebboy10'){
  res.render('adminpriv', { title: 'Admin Console' });
  }
});

router.get('/addLike', function(req, res, next) {
  fs.readFile('likeNumber.txt', 'utf-8', function (err, read) {
    if (err) throw err;
    fs.writeFile('likeNumber.txt', parseInt(read) + 1, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    }); 
  });
  res.redirect('/');
});

router.get('/resetAll', function(req, res, next) {
  fs.writeFile('likeNumber.txt', 0, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  }); 
  res.redirect('/');
});

router.get('/removeLike', function(req, res, next) {
  fs.readFile('likeNumber.txt', 'utf-8', function (err, read) {
    if (err) throw err;
    fs.writeFile('likeNumber.txt', parseInt(read) - 1, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    }); 
  });
  res.redirect('/');
});

module.exports = router;