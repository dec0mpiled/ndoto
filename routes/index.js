var express = require('express');
var router = express.Router();
var fs = require('fs');
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
 // if (app.get('env') === 'production'){
  //  res.redirect('/dev');
 // } else {
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
