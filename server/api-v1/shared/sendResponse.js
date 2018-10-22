'use strict';

module.exports = (response, res, next) => {
    const validationError = res.validateResponse(200, response);
    if(validationError) {
        console.log('Failing response:');
        console.log(JSON.stringify(response, null, 2));
        return next(validationError);
    }
    res.send(response);
}
