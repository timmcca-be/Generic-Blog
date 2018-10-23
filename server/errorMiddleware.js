'use strict';

module.exports = (err, req, res, next) => {
    const serverError = () => res.status(500).send({ error: 'Internal server error' });
    if(!err.status) {
        console.log('Error:');
        console.log(err instanceof Error ? err : JSON.stringify(err, null, 2));
        return serverError();
    }
    const code = err.status;
    delete err.status;
    const validationError = res.validateResponse(code, err);
    if(validationError) {
        console.log('Failing response (status: ' + code + '):');
        console.log(JSON.stringify(err, null, 2));
        console.log('Error:');
        console.log(JSON.stringify(validationError, null, 2));
        return serverError();
    }
    res.status(code).send(err);
}
