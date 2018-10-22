'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, scopes, definition) => {
    const error = {
        status: 401,
        error: 'You are not logged in'
    };
    if(!req.headers.authorization || req.headers.authorization.substring(0, 7) !== 'Bearer ') {
        throw error;
    }
    const token = req.headers.authorization.substring(7);
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err) {
        if(err instanceof jwt.JsonWebTokenError) {
            throw error;
        }
        throw err;
    }
    if(decoded.type !== 'login') {
        throw error;
    }
    req.auth = decoded;
    return true;
};
