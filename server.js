'use strict'
var express = require('express');
var db=require('./db')
var path =require('path');
var swig = require('swig');
swig.setDefaults({ cache:false })
var app = express();
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
var routes = require('./routes/users.js');

app.use('/vendor', express.static(path.join(__dirname,'node_modules')));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('method-override')('_method'));   //looks in POST for things like ?_method=DELETE

app.use('/',function(req,res,next) {
  console.log(req.url);
  next();
});

app.use('/', routes);

app.get('/',function(req,res, next) {
  res.render('index', { nav: req.url });
});


var port = process.env.PORT || 3000;




app.listen(port, function() {
  console.log(`listening on port ${port}`);
  db.sync(function(err) {
    if(err){
      return console.log(err.message);
    }
    db.seed(function(err) {
      if(err){
        return console.log(err.message);
      }
      db.getUsers(true, function(err, users) {
        if(err){
          return console.log(err.message);
        }
        console.log(users);
      });
    })
  }); //sync for tables to get created
});
