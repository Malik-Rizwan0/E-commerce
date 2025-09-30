const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if(err.name === "CastError"){
        err.statusCode = 400;
        err.message = `Resource not found. Invalid: ${err.path}`;
    }
    // Mongoose duplicate key(mail) error
    if(err.code === 11000){
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }
    // wrong JWT error
    if(err.name === "JsonWebTokenError"){
        err.statusCode = 400;
        err.message = 'JSON Web Token is invalid, try again';
    }
    // JWT expired error
    if(err.name === "TokenExpiredError"){
        err.statusCode = 400;
        err.message = 'JSON Web Token is expired, try again';
    }
    res.status(statusCode).json({
        success: false,
        name : err.name || 'Error',
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
