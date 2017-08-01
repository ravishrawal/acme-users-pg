var router = require('express').Router();
var db = require('../db');

module.exports = router;

router.get('/users', function(req, res, next) {
  db.getUsers(false, function(err, users) {
    if(err){
      return next(err);
    }
    console.log(users)
    res.render('users', { users: users, nav: req.url })
  });
});

router.get('/users/managers', function(req, res, next) {
  db.getUsers(true, function(err, managers) {
    if(err){
      return next(err);
    }
    res.render('managers', { managers: managers, nav: req.url })
  });
});

router.post('/users', function(req, res, next) {
  console.log(req.body);
  db.createUser(req.body, function(err) {
    if(err){
      return next(err);
    }
    res.redirect('/users');
  });
});

router.put('/users/:id', function(req, res, next) {
  db.promote(req.params.id, function(err) {
    if(err){
      return next(err);
    }
    res.redirect('/users');
  });
});

router.delete('/users/:id', function(req, res, next) {
  console.log(req.params.id);
  db.deleteUser(req.params.id, function(err) {
    if(err){
      next(err);
    }
    res.redirect('/users'); 
  });
});
