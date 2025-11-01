const error = (err, req, res, next) => {
    if(err.name==="ValidationError"){
        err.statusCode = 400;
    }
    if(err.name==="CastError"){
        err.statusCode = 400;
    }
    if(err.code===11000){
        err.statusCode = 409;
    }
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errObj: err,
        errLine: err.stack
    });
}

module.exports = error;