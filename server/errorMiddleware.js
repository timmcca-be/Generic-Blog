'use strict';

const validationService = require('./api-v1/services/validationService');

module.exports = (err, req, res, next) => {
    const internalServerError = { error: 'Internal server error' };
    if(err.status) {
        const status = err.status;
        delete err.status;
        try {
            validationService.validate(err, res, status);
            return res.status(status).send(err);
        } catch(err) {
            console.log(JSON.stringify(err, null, 2));
            return res.status(500).send(internalServerError);
        }
    }
    if(err instanceof Error) {
        console.log(err);
    } else {
        console.log(JSON.stringify(err));
    }
    return res.status(500).send(internalServerError);
}
