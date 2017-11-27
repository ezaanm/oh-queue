var db = require('../db/databases.js');

var getLogin = function (req, res) {
  res.render('login.ejs', {error: req.session.err});
  req.session.err = null;
}

var checkLogin = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  //TODO: get from db and check if user and admin, set session.admin
}

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
    req.session.admin = true;
    res.redirect('/queue');
  } else if (checked) {
    req.session.err = 'wrong admin password';
    res.redirect('/signup');
  } else {
    //TODO: store the user in the db
    res.redirect('/queue');
  }
} 

var queue = function (req, res) {
  //some sort of socketIO stuff!
}

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