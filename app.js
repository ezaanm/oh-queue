var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = require('./db/databases.js');

app.use(express.bodyParser());
app.use(express.logger('default'));
app.use(express.cookieParser());
app.use(express.session({secret: 'duck'}));

//all routes of the site
app.get('/', routes.get_login);
app.post('/checkLogin', routes.check_login);
app.get('/signup', routes.sign_up);
app.post('/createAccount', routes.create_account);
app.get('/logout', routes.logout);
app.get('/queue', routes.queue);

var numStudents = 0;

io.on('connection', function(socket) {
  console.log('Client connected...');
  
  db.getQueue(function(data, err) {
    if (err) {
      console.log(err);
    } else if (data) {
      console.log('sending inital data to client');
      console.log(data);
      socket.emit('data', {items: data, count: numStudents});
    }
  });
  
  var addedUser = false;
  
  socket.on('add student', function(data) {
    if (addedUser) {
      socket.emit('already added');
      return;
    }
    
    var val = JSON.stringify({helped: 'not atm', name: data.fullname});
    var usernameToAdd = data.username;
    db.addQueue(usernameToAdd, val, function(data, err) {
      if (err) {
        console.log(err);
      }
    });
    
    console.log('hiya');
    socket.username = usernameToAdd;
    numStudents++;
    addedUser = true;
    io.sockets.emit('student added', {name: socket.username, count: numStudents, fullname: data.fullname});
  });
  
  socket.on('delete student', function(user) {
    db.deleteQueue(user, function(data, err) {
      if (err) {
        console.log(err);
      }
    });
    
    numStudents--;
    io.sockets.emit('student deleted', {name: user, count: numStudents})
  });
  
  socket.on('clear request', function() {
    db.clearQueue(function(err) {
      if (err) {
        console.log(err);
      }
    });
    
    io.sockets.emit('clear');
  });
  
  socket.on('help student', function(data) {
    db.updateQueue(data.username, {helped: 'YES RN by '+ socket.username +''}, function(data, err) {
      if (err) {
        console.log(err);
      }
    });
    
    io.sockets.emit('helping', {username: data.username, by: data.by});
  });
  
  socket.on('unblockQ', function() {
    addedUser = false;
  });
  
});

server.listen(8080);
console.log('Server running on 8080');