'use strict';

function serverError(res) {
    // Thought about using response validation here, decided the risk of an infinite loop
    // (invalid response! better send the "internal server error" response. invalid response! ...)
    // outweighs the benefits here
    // It is an object literal so realistically it shouldn't make a difference whether it's validated
    // unless the spec changes pretty dramatically
    res.status(500).send({ error: 'Internal server error' });
}

module.exports = (err, req, res, next) => {
    if(!err.status) {
        // Properly formatted error response objects contain an integer "code" property
        // The lack of that property indicates an internal server error
        console.log('Error:');
        console.log(err instanceof Error ? err : JSON.stringify(err, null, 2));
        return serverError(res);
    }
    const code = err.status;
    delete err.status;
    if(res.validateResponse) {
        const validationError = res.validateResponse(code, err);
        if(validationError) {
            console.log('Failing response (status: ' + code + '):');
            console.log(JSON.stringify(err, null, 2));
            console.log('Error:');
            console.log(JSON.stringify(validationError, null, 2));
            return serverError(res);
        }
    }
    res.status(code).send(err);
}
