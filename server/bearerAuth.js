'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, scopes, definition) => {
    const error = {
        status: 401,
        error: 'You are not logged in'
    };
    if(!req.headers.authorization || req.headers.authorization.substring(0, 7) !== 'Bearer ') {
        // Bearer auth has to be manually implemented, since OpenAPI 2.0 doesn't include it
        throw error;
    }
    // Chop off "Bearer "
    const token = req.headers.authorization.substring(7);
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err) {
        if(err instanceof jwt.JsonWebTokenError) {
            // invalid token, throw authentication error
            throw error;
        }
        // Initially I assumed that all errors here would be web token errors. After spending a few hours figuring out
        // that I had forgotten to require jsonwebtoken, I realized that catch blocks without error type checking are
        // terrible
        throw err;
    }
    if(decoded.type !== 'login') {
        // Someone is trying to log in with an account confirmation token or password reset token
        throw error;
    }
    req.auth = decoded;
    return true;
};
