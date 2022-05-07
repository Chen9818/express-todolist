var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({path:"./config.env"})

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB)
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error)
    })

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use((req, res, next) => {
	res.status(404).json({
		status: 'ERROR',
		message: '找不到網頁 404 Not Found，請重新確認'
	});
});

module.exports = app;
