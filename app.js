const express = require("express");
var bodyParser = require('body-parser')
const { initDBCallBack } = require('./db/connection')
var fs = require('fs')
const mongoose = require("mongoose");
const cors = require("cors");
global.path = require('path')
global.fsx = require('fs.extra')
global._ = require('underscore')
global.__basedir = __dirname
global._request = require('request')
global._rootPath = path.dirname(require.main.filename)
global._libsPath = path.normalize(path.join(__dirname, 'libs'))
global.mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()
const PORT = 8000;
require('colors')
switch (process.env.NODE_ENV) {
  case 'development':
      global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.dev.json')))
      break
  case 'production':
      global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')))
      break
  default:
      global._config = require(path.normalize(path.join(__dirname, 'config', 'conf.json')))
      break
}

const app = express();
global._dbPath = 'mongodb://' + _config.database.ip + ':' + _config.database.port + '/' + _config.database.name
global._moment = require('moment')
global.moment = global._moment
global._async = require('async')
global.mongoose = require('mongoose')
global._dbName = _config.database.name
global._initDBCallBack = initDBCallBack

global.pagination = require('pagination')

require(path.join(__dirname, 'libs', 'resource'))

var cron = require('node-cron')
if (_config.database.user && _config.database.pwd) {
  if (_config.replicaSet && _config.replicaSet.replicaSetName) {
      global._dbPath = getConnRS(_config.replicaSet.user, _config.replicaSet.pwd)
  } else {
      global._dbPath = 'mongodb+srv://' + _config.database.user + ':' + _config.database.pwd + '@' + _config.database.ip + '/' + _config.database.name
  }
}
_initDBCallBack(_dbPath, _dbName, function (err, db, client) {
  if (err) return process.exit(1)
  global['mongoClient'] = db

  const redisClient = require("./caches/redis")
  redisClient.init(_config.redis)
})
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('view cache', false)
app.set('port', process.env.PORT || _config.app.port)
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('cookie-parser')('dft.vn'))
app.use(require('express-session')({ secret: 'dft.vn', resave: false, saveUninitialized: true }))
app.use(require('multer')({ dest: path.join(__dirname, 'temp') }).any())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.resource = require(path.join(__dirname, 'libs', 'resource'))
console.log("app",app);
switch (process.env.NODE_ENV) {
  case 'development':
      require(path.join(_rootPath, 'libs', 'router.js'))(app)
      break
  case 'production':
      require(path.join(_rootPath, 'libs', 'router.js'))(app)
      break
  default:
      require(path.join(_rootPath, 'libs', 'router.js'))(app)
      break
}
app.use(function (req, res, next) {
  res.render('404', { title: '404 | Page not found' })
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('500', { message: err.message })
  console.log(err)
})

var handleOnServerStart = function () {
  console.log(("Server is running at " + app.get('port')).magenta)
}
var server = app.listen(app.get('port'), handleOnServerStart)