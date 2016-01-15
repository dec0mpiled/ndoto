var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();
var email = require('emailjs')

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('likeNumber.txt', 'utf-8', function(err, read) {
      if (err) throw err;
      res.render('index', { title: 'nDoto', likeNumber: parseInt(read) });
    });
//  }
});


/* GET credits page */
router.get('/credits', function(req, res, next) {
  res.render('credits', { title: 'Credits' });
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
  
  var i=0
  var findname
  var findusername
  var findpass
  
  // req.body.(name of item)
   var username = req.body.username;
   var password = req.body.password;

    fs.readFile('registerednames.csv', 'utf-8', function (err, reada) {
    if (err) throw err;
    console.log(reada);
    var newtext = reada.toString();
    var buscar = newtext.search(username);
    console.log(buscar);
    if (buscar>-1) {
      res.render('login', {
        err: 'name in use!'
      });
    }
    
  else {
 fs.appendFile('users.csv', '%' + username + '%: {' + username + ',' + password + '}' + '\n', function(err) {
    fs.appendFile('registerednames.csv', username + '\n')
   var read = fs.readFile('users.csv', 'utf-8', function (err, read) {
    read.toString();
    console.log(read);
    /*for (i=0; i < read.length; i++) {
      var currentchar= read.charAt(i);
      console.log(currentchar);
    } */
    
    var cu = read.search(",")
    var cu1 = read.search(":")
    var cu2 = read.search("{")
    var cu3 = read.search("}")
    parseInt(cu);
    parseInt(cu1);
    parseInt(cu2);
    parseInt(cu3);
          if (err) throw err;
          console.log(cu);
          console.log(cu1);
          console.log(cu2);
          console.log(cu3);
    var findname = read.substring(0, cu1);
    var findusername = read.substring(cu2+1, cu);
    var findpass = read.substring(cu+1, cu3);
     console.log(findname);
     console.log(findusername);
     console.log(findpass);
     res.redirect('/regisComplete/'+username);
   }); 
    
    if (err) throw err;
    
  });
};
});
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

router.get('/admin*:key', function(req, res, next) {
  if (req.params.key=='tar*112715'){
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