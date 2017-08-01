var pg = require('pg'); //postgres module
var sql = require('./seed').sql;


var client = new pg.Client(process.env.DATABASE_URL);  //creates client to interact with postgres at db url given

client.connect(function(err) {
  if(err){
    console.log(err.message);
  }
})

function sync(cb) {
  query(sql, null, function(err) {
    if(err){
      return cb(err);    //return to exit
    }
    cb(null);
  })
}

function query(sql, params, cb) {
  client.query(sql, params, cb);
}

function createUser(user, cb) {
  query('INSERT INTO users (name) values ($1) RETURNING id', [ user.name ], function(err, result) {    //$ sign makes it refer to 2nd arg
    if(err){
      return cb(err);
    }
    cb(null, result.rows[0].id);
  });
}

function getUsers(cb) {
  query('SELECT * FROM users', null, function(err, result) {
    if(err){
      return cb(err);
    }
    cb(null, result.rows);
  });
}

function deleteUser(id, cb) {
  query('DELETE FROM users WHERE id = $1', [ id ], function(err, result) {
    if(err){
      return cb(err);
    }
    cb(null);
  })
}

function seed(cb) {
  createUser({name: 'foo', isManager: false}, function(err, id) {
    if(err){
      return cb(err);
    }
    console.log(id);
    cb(null);
  })
}

module.exports = {
  sync,
  seed,
  createUser,
  getUsers,
  deleteUser
}
