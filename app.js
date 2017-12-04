'use strict';

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    session = require('express-session'),
    flash = require('express-flash'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    configs = require('./config/');

configs = require('./app/utils/getIp.js')(configs);


var app = express();

// ensure log directory exists
var logDirectory = configs.path.logs;
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var logger = require('./app/utils/log.js');
logger.use(app);

app.models = require(configs.path.models);
app.configs = configs;

// view engine setup
app.set('view engine', 'jade');
app.set('trust proxy', 1); // trust first proxy
app.set('views', configs.path.views);
app.set('port', configs.port);
app.use(express.static(configs.path.public));

if (app.get('env') === 'development' || app.get('env') === 'test') {
    console.log(app.settings);
    console.log(app.configs);
    app.use(morgan('dev'));
} else {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'authbox',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 2 * 60 * 100000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

require('./app/route')(app, passport);

console.log('-------------------------------');
console.log('访问: ' + configs.domainUrl);
var port = configs.port != 80 ? ':' + configs.port : '';
configs.IPv4Address.forEach(function (ip) {
    console.log('ip访问: ' + ip + port );
});
console.log('-------------------------------');

module.exports = app;
