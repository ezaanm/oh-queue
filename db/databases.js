var keyvaluestore = require('../db/keyvaluestore.js');
var async = require('async');
var kvs = new keyvaluestore('ohusers');
var kvsQ = new keyvaluestore('ohqueue');
kvs.init(function(err, data){});
kvsQ.init(function(err, data){});

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
  console.log('Looking up: ' + key);	
  kvs.get(key, function (err, data) {
    if (err) {
      callback(null, 'Lookup error: ' + err);
    } else if (data == null) {
      callback(null, null);
    } else {
      var object = JSON.parse(data[0].value);
      callback({password: object.password, isAdmin: object.instructor, name: object.fullname}, null);
    }
  });
};

var getQueue = function (callback) {
  console.log('getting past items');
  kvsQ.getItems(function (err, data) {
    if (err) {
      callback(null, 'Lookup error: ' + err);
    } else if (data == null) {
      callback(null, null);
    } else {
      callback(data, null);
    }
  });
}

var addQueue = function(key, val, callback){
  console.log('adding User: ' + key);	
  kvsQ.put(key, val, function (err, data) {
    if (err) {
    	console.log('meep, error when adding ' + word[0] + ': ' + err);
    	callback(null, err);
    } else {
    	callback(null, null);
    }
  });
};

var updateQueue = function(key, val, callback){
  console.log('updating' + key);
  var inx = -1;
  kvsQ.get(key, function(err, data) {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        inx = data[i].inx;
      }
      
      kvsQ.update(key, inx, val, function(err, data) {
        if (err) {
          console.log(err);
          callback(null, err);
        } else {
          callback(null, null);
        }
      });
    }
  });
};

var deleteQueue = function(key, callback){
  console.log('deleting: ' + key);
  var inx = -1;
  kvsQ.get(key, function(err, data) {
    if (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        inx = data[i].inx;
      }
      
      kvsQ.remove(key, inx, function(err, data) {
        if (err) {
          console.log(err);
          callback(null, err);
        } else {
          callback(null, null);
        }
      });
    }
  });
};

var clearQueue = function (callback) {
  console.log('clearing database');
  kvsQ.scanKeys(function (err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else if (data) {
      async.forEach(data, function(item, cb) {
        kvsQ.remove(item.key, item.inx, function (err, data) {
          if (err) {
            console.log(err);
            callback(err);
          } else {
            cb();
          }
        });
      });
      callback(null);
    } else {
      callback(null);
    }
  });
};

var database = { 
  lookupUser: lookupUser,
  addUser: addUser,
  getPassword: getPassword,
  getQueue: getQueue,
  addQueue: addQueue,
  updateQueue: updateQueue,
  deleteQueue: deleteQueue,
  clearQueue: clearQueue
};
                                        
module.exports = database;