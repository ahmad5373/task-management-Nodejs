const { sendResponse } = require('../utility/api');

const errorHandler = (err, req, res, next) => {
    console.log('im errorHandler');
    const errStatus = err?.code || 500;
    const errMsg = err?.message || 'Something went wrong';

    return sendResponse(res, errStatus, errMsg);
}

module.exports = errorHandler;