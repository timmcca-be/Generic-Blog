'use strict';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const readFile = require('util').promisify(fs.readFile);
const { initialize } = require('express-openapi');

module.exports = async (app) => {
    const apiDoc = initialize({
        app,
        apiDoc: await readFile(path.resolve(__dirname, './api-v1/api-doc.yml'), 'utf8'),
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
        paths: path.resolve(__dirname, './api-v1/paths'),
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
                } catch(e) {
                    if(e instanceof jwt.JsonWebTokenError) {
                        throw error;
                    }
                    throw e;
                }
                if(decoded.type !== 'login') {
                    throw error;
                }
                req.auth = decoded;
                return true;
            }
        }
    }).apiDoc;

    // remove trailing slashes on routes using the *route name*/index.js file structure
    Object.keys(apiDoc.paths).sort().forEach((key) => {
        const content = apiDoc.paths[key];
        delete apiDoc.paths[key];
        const newKey = key[key.length - 1] === '/' ? key.substring(0, key.length - 1) : key;
        apiDoc.paths[newKey] = content;
    });
    
    return apiDoc;
};
