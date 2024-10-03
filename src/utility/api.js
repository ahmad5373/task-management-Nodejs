const sendResponse = (responseObj, statusCode, message, errors = [], data = []) => {
    console.log('sendResponse api is calling');
    const response = {
      status: true,
      message: '',
      errors: [],
      data: []
    };

    if ([200, 201, 202, 203, 204].includes(statusCode)) {
        response.status = true;
    } else {
        response.status = false;
    }

    response.message = message ?? '';
    response.errors = errors.length == 0 ? {} : errors;
    response.data = data.length == 0 ? {} : data;

    // responseObj.status(statusCode).json(response);
    responseObj.status(statusCode).json(response);
}

module.exports = {
    sendResponse
};