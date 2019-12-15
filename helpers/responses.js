exports.statusCodes = {
    SUCCESS         : 200,
    FAILURE         : 400,
    NOT_FOUND       : 404,
    SERVER_ERROR    : 500
}
exports.responseMessages = {
    SUCCESS         : "Success",
    FAILURE         : "Failed",
    NOT_FOUND       : "Not Found",
    SERVER_ERROR    : "Internal Server Error"
}

exports.sendResponse = function (code, message, data) {
    return {
        statusCode : code    || statusCodes.SUCCESS,
        message    : message || responseMessages.SUCCESS,
        data       : data    || {}
    }
}