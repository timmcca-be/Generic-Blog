'use strict';

module.exports = { respond };

/*
func should accept an Express res object that returns what should be sent to the user based on the request
This returns an Express route function that uses func
*/
function respond(func, code = 200) {
    return (req, res, next) =>
        func(req).then(response => {
            const validationError = res.validateResponse(code, response);
            if(validationError) {
                console.log('Failing response (status: ' + code + '):');
                console.log(JSON.stringify(response, null, 2));
                throw validationError;
            }
            res.status(code).send(response);
        }).catch(next);
}
