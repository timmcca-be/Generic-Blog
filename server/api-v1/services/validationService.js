'use strict';

module.exports = { validate };

function validate(response, res, code = 200) {
    if(!res.validateResponse) {
        return;
    }
    const validationError = res.validateResponse(code, response);
    if(!validationError) {
        return;
    }
    console.log('Failing response:');
    console.log(JSON.stringify(response, null, 2));
    throw validationError;
}
