var db = require('../db/databases.js');
var SHA3 = require('crypto-js/sha3');

//display login page
var getLogin = function (req, res) {
  res.render('login.ejs', {error: req.session.err});
  req.session.err = null;
}

//check username and password in the db and set the session states
var checkLogin = function (req, res) {
  var username = req.body.username;
  var password = SHA3(req.body.password).toString();
  db.getPassword(username, function(data, err) {
    if (err) {
          req.session.err = err;
          res.redirect('/');
        } else if (data) {
          if (data.password === password) {
            req.session.name = data.name;
            req.session.user = username;
            req.session.err = null;
            if (data.isAdmin) {
              req.session.admin = true;
            } else {
              req.session.admin = null;
            }
            res.redirect('/queue');
          } else {
            req.session.err = 'your password was wrong mate';
            res.redirect('/');
          }
        } else {
          req.session.err = 'you dont exist, create an account yo';
          res.redirect('/');
        }
  });
}

//redner signup page
var signUp = function (req, res) {
  res.render('signup.ejs', {error: req.session.err});
  req.session.err = null;
}

//create an account logic and error handling
var createAccount = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var checked = false;
  if (req.body.instructor) {
    checked = true;
  }
  var instructorPass = req.body.instructorPass;
  
  if (!username || !password || !fullname) {
    req.session.err = 'you left a field blank mate';
    res.redirect('/signup');
  }
  
  if (checked && instructorPass == 'admin') {
    var encryptedPass = SHA3(password).toString();
    var userObj = {password: encryptedPass, fullname: fullname, instructor: true};
    var stringUser = JSON.stringify(userObj);
    db.addUser(username, stringUser, function(data, err) {
      if (err) {
        req.session.err = err;
        res.redirect('/signup');
      }
    });
    
    req.session.name = fullname;
    req.session.user = username;
    req.session.admin = true;
    res.redirect('/queue');
  } else if (checked) {
    req.session.err = 'wrong admin password';
    res.redirect('/signup');
  } else {
    var encryptedPass = SHA3(password).toString();
    var userObj = {password: encryptedPass, fullname: fullname, instructor: false};
    var stringUser = JSON.stringify(userObj);
    db.addUser(username, stringUser, function(data, err) {
      if (err) {
        req.session.err = err;
        res.redirect('/signup');
      }
    });
    
    req.session.name = fullname;
    req.session.user = username;
    req.session.admin = null;
    res.redirect('/queue');
  }
} 

//Send to userQ or adminQ depending on sign in
var queue = function (req, res) {
  if (!req.session.user) {
    req.session.err = 'you are not logged in';
    res.redirect('/');
  }
  
  if (req.session.admin) {
    res.render('adminQueue.ejs', {username: req.session.user, fullname: req.session.name});
  } else {
    res.render('userQueue.ejs', {username: req.session.user, fullname: req.session.name});
  }
}

//log user out, redirect to home
var logout = function (req, res) {
  req.session.destroy();
  res.redirect('/'); 
}

var routes = {
  get_login: getLogin,
  check_login: checkLogin,
  sign_up: signUp,
  create_account: createAccount,
  logout: logout,
  queue: queue
}

module.exports = routes;