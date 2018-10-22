'use strict';

const path = require('path');
const jwt = require('jsonwebtoken');
const { initialize } = require('express-openapi');

const context = require.context('./api-v1/paths', true, /\.js$/);

module.exports = async (app) => {
    const apiDoc = initialize({
        app,
        apiDoc: require('./api-v1/api-doc.js'),
        paths: context.keys().map((key) => {
            // the key is formatted as './*path*.js'
            // this removes the leading '.' and the ending '.js'
            let path = key.substring(1, key.length - 3);
            if(path === '/index') {
                // ./api-v1/paths/index.js points to /
                path = '/';
            } else if(path.substring(path.length - 6) === '/index') {
                // ./api-v1/paths/*something*/index.js points to /*something*
                path = path.substring(0, path.length - 6);
            }
            return {
                path,
                // load the module from webpack context
                module: context(key)
            }
        }),
        dependencies: {
            postsService: require('./api-v1/services/postsService'),
            authService: require('./api-v1/services/authService')
        },
        errorMiddleware: function(err, req, res, next) {
            const internalServerError = { error: 'Internal server error' };
            if(err.status) {
                const status = err.status;
                delete err.status;
                if(res.validateResponse) {
                    const validationError = res.validateResponse(status, err)
                    if(validationError) {
                        console.log(JSON.stringify(validationError, null, 2));
                        return res.status(500).send(internalServerError);
                    }
                }
                return res.status(status).send(err);
            }
            if(err instanceof Error) {
                console.log(err);
            } else {
                console.log(JSON.stringify(err));
            }
            return res.status(500).send(internalServerError);
        },
        securityHandlers: {
            Bearer: (req, scopes, definition) => {
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
            }
        }
    }).apiDoc;
    
    return apiDoc;
};
