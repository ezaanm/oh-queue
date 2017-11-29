var express = require('express');
var routes = require('./routes/routes.js');
var app = express();

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

app.listen(8080);
console.log('Server running on 8080');