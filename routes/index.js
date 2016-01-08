var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();

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

/* GET RegisterSubmit*/
// document is not defined
// you have to use POST

router.post('/regsubmit', function(req, res, next) {
  
  // req.body.(name of item)
  var username = req.body.username;
  var password = req.body.password;
  
  fs.appendFile('users.csv', username + ': {' + username + ',' + password + '}' + '\n', function(err) {
    fs.appendFile('registerednames.csv', username + '\n')
    if (err) throw err;
    res.redirect('/');
  });
  
});

/* GET login/register page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
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
