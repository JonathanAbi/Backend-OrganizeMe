const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    //set default
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    }

    //error validation mongoose
    if(err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(', ')
        customError.statusCode = 400
    }

    // Cek jika error adalah MongoDB Duplicate Key Error
    if(err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`
        customError.statusCode = 400
    }
    // Jika error adalah CastError (error karena tipe data salah)
    if(err.name === 'CastError'){
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware