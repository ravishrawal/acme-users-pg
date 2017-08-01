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
  query('INSERT INTO users (name, isManager) values ($1, $2) RETURNING id', [ user.name, user.isManager ], function(err, result) {    //$ sign makes it refer to 2nd arg
    if(err){
      return cb(err);
    }
    cb(null, result.rows[0].id);
  });
}

function getUsers(managersOnly, cb) {
  if(managersOnly===true){
    query('SELECT * FROM users WHERE isManager = $1', [ true ], function(err, result) {
      if(err){
        return cb(err);
      }
      cb(null, result.rows);
    });
  } else {
    query('SELECT * FROM users', null, function(err, result) {
      if(err){
        return cb(err);
      }
      cb(null, result.rows);
    });
  }
}

function deleteUser(id, cb) {
  query('DELETE FROM users WHERE id = $1', [ id ], function(err, result) {
    if(err){
      return cb(err);
    }
    cb(null);
  })
}

function promote(id, cb) {
  query('UPDATE users SET isManager = true WHERE id = $1', [ id ], function(err, result) {
    if(err){
      return cb(err);
    }
    cb(null, result.rows);
  });
}

function seed(cb) {
  createUser({name: 'Brother Bear', isManager: true}, function(err, id) {
    if(err){
      return cb(err);
    }
    console.log(id);
    cb(null);
  })
}

function count(bool) {
    query('SELECT COUNT(*) FROM users WHERE isManager = $1', [ bool ], function(err, result) {
      if(err){
        return console.log(err.message);
      }
      console.log(result.rows[0].count);
      return result.rows[0].count;
    });
}


module.exports = {
  sync,
  seed,
  createUser,
  getUsers,
  deleteUser,
  promote,
  count
}
