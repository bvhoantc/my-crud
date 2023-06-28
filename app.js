var express = require('express');
var bodyParser = require('body-parser');
require('mongoose-pagination');
const { initDBCallBack } = require('./db/connections');
const nameFolder = {
    log: 'log',
}

require('colors');
global._socketUsers = {};
global.path = require('path');
global.fsx = require('fs.extra');
global._ = require('underscore');
global.__basedir = __dirname;
global._request = require('request');
global._rootPath = path.dirname(require.main.filename);
global._libsPath = path.normalize(path.join(__dirname, 'libs'));
const dotenv = require('dotenv')
dotenv.config()

switch (process.env.NODE_ENV) {
    case 'development':
        global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')));
        break;
    case 'production':
        global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')));
        break;
    default:
        global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')));
        break;
}
global._dbPath = 'mongodb://' + _config.database.ip + ':' + _config.database.port ;
// global._dbPath = 'mongodb+srv://' + _config.database.user + ':' + _config.database.pwd + '@' + _config.database.ip
global._moment = require('moment');
global.moment = global._moment;
global._async = require('async');
global.mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
global._dbName = _config.database.name;
global._initDBCallBack = initDBCallBack;

global.mongodb = require('mongodb');
global.pagination = require('pagination');
global._Excel = require('exceljs');

require(path.join(__dirname, 'libs', 'resource'));
var cron = require('node-cron');

_initDBCallBack(_dbPath, _dbName, function (err, db, client) {
    if (err) return process.exit(1);
    global['mongoClient'] = db;
    // console.log("global['mongoClient']",global['mongoClient']);
});
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('port', _config.app.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// End setting module
app.use(require('cookie-parser')('dft.vn'));
app.use(require('express-session')({ secret: 'dft.vn', resave: false, saveUninitialized: true }));
app.use(require('multer')({ dest: path.join(__dirname, 'temp') }).any());
app.use(require('serve-favicon')(path.join(__dirname, 'assets', 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(require(path.join(_rootPath, 'libs', 'auth')).auth);
// require(path.join(_rootPath, 'libs', 'cleanup.js')).Cleanup();
switch (process.env.NODE_ENV) {
    case 'development':
        require(path.join(_rootPath, 'libs', 'router.js'))(app);
        break;
    case 'production':
        require(path.join(_rootPath, 'libs', 'router.js'))(app);
        break;
    default:
        require(path.join(_rootPath, 'libs', 'router.js'))(app);
        break;
}

app.use(function (req, res, next) {
    res.render('404', { title: '404 | Page not found' });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', { message: err.message });
});


var handleOnServerStart = function () {
    console.log(("Server is running at " + app.get('port')).magenta);
};
var server = app.listen(app.get('port'), handleOnServerStart);

// global.sio = require('socket.io').listen(server, { log: false });
// sio.on('connection', function (socket) {
//     require(path.join(_rootPath, 'socket', 'io.js'))(socket);
// });