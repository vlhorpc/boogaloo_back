const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')

const routes = require('./routes');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Connection URL
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(() => {
  console.log('Connected correctly to NoSQL Database');
}, (err) => { console.log(err); });

// const index = require('./routes/indexRouter');
// const users = require('./routes/users');

const app = express();

// Adding routes to the project


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

module.exports = app;
