//自定義可預期
const appError = (httpStatus,errMessage,next)=>{
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);  //傳至app.js的錯誤管理
}

module.exports = appError;