var db = require('../db/databases.js');

//display login page
var getLogin = function (req, res) {
  res.render('login.ejs', {error: req.session.err});
  req.session.err = null;
}

//check username and password in the db
var checkLogin = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.getPassword(username, function(data, err) {
    if (err) {
          req.session.err = err;
          res.redirect('/');
        } else if (data) {
          if (data.password === password) {
            req.session.user = username;
            req.session.err = null;
            if (data.isAdmin === 'true') {
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
    //TODO: store user in db as instructor
    var userObj = {password: password, fullname: fullname, instructor: true};
    var stringUser = JSON.stringify(userObj);
    db.addUser(username, stringUser, function(data, err) {
      if (err) {
        req.session.err = err;
        res.redirect('/signup');
      }
    });
    
    req.session.admin = true;
    res.redirect('/queue');
  } else if (checked) {
    req.session.err = 'wrong admin password';
    res.redirect('/signup');
  } else {
    var userObj = {password: password, fullname: fullname: instructor: false};
    var stringUser = JSON.stringify(userObj);
    db.addUser(username, stringUser, function(data, err) {
      if (err) {
        req.session.err = err;
        res.redirect('/signup');
      }
    });
    
    req.session.admin = null;
    res.redirect('/queue');
  }
} 

//create server, connect clients
var queue = function (req, res) {
  //TODO: sockets && queueu
  //some sort of socketIO stuff!
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