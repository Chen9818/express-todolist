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

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！')
    console.error(err);
    process.exit(1);
});
//404錯誤
app.use('/posts', postsRouter);
app.use((req, res, next) => {
	res.status(404).json({
		status: 'ERROR',
		message: '找不到網頁 404 Not Found，請重新確認'
	});
});

// express錯誤處理
// 自己設定的err錯誤  production環境錯誤
const resErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            message: err.message
        });
    } else {
        //log 記錄
        console.log('出現重大錯誤', err);
        // 送出罐頭預設訊息
        res.status(500).json({
            status: 'error',
            message: '系統錯誤，請恰系統管理員'
        });
    }
};
// dev環境錯誤
const resErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        error: err,
        stack: err.stack
    });
};

// 錯誤處理 (會透過appError傳遞錯誤過來)
app.use(function(err, req, res, next) {
    // dev
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === 'dev') {
        return resErrorDev(err, res);
    } 
    // production
    if (err.name === 'ValidationError'){
        err.message = "資料欄位未填寫正確，請重新輸入！"
        err.isOperational = true;
        return resErrorProd(err, res)
    }
    resErrorProd(err, res)
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
