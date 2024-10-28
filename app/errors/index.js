const CustomAPIError = require ('./customApiError')
const BadRequestError = require ('./badRequest')
const NotFoundError = require ('./notFound')
const UnauthorizedError = require ('./unauthorized')
const UnauthenticatedError = require ('./unauthenticated')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    UnauthenticatedError,
}