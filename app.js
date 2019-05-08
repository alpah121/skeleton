var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var config = require('./config.json');
var manifest = require('./routes/manifest');

var app = express();

mongoose.connect(config.dbString, {useNewUrlParser: true}, (err) => {console.log(err)});
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(expressSession({secret: '14372ads', saveUninitialized: false, resave: false}));
app.use('/', manifest);

app.listen(3000, () => console.log('parts app on 3000'));
