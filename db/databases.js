var keyvaluestore = require('../models/keyvaluestore.js');
var async = require('async');
var kvs = new keyvaluestore('ohusers');
kvs.init(function(err, data){});

//get value of a user
var lookupUser = function(key, callback){
  console.log('Looking up: ' + key);	
  kvs.get(key, function (err, data) {
    if (err) {
      callback(null, 'Lookup error: ' + err);
    } else if (data == null) {
      callback(null, null);
    } else {
      callback({value : data[0].value}, null);
    }
  });
};

//add user to database
var addUser = function(key, val, callback){
  console.log('adding User: ' + key);	
  kvs.put(key, val, function (err, data) {
    if (err) {
    	console.log('meep, error when adding ' + word[0] + ': ' + err);
    	callback(null, err);
    } else {
    	callback(null, null);
    }
  });
};

//get password and admin status from database for a user
var getPassword = function(key, callback){
  console.log('Looking up: ' + searchTerm);	
  kvs.get(key, function (err, data) {
    if (err) {
      callback(null, 'Lookup error: ' + err);
    } else if (data == null) {
      callback(null, null);
    } else {
      var object = JSON.parse(data[0].value);
      callback({password: object.password, isAdmin: object.instructor}, null);
    }
  });
};

var database = { 
  lookupUser: lookupUser,
  addUser: addUser,
  getPassword: getPassword,
};
                                        
module.exports = database;