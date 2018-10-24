'use strict';

const { initialize } = require('express-openapi');

module.exports = (app, paths, dependencies) => initialize({
    app,
    apiDoc: require('./api-v1/api-doc.js'),
    paths,
    dependencies,
    errorMiddleware: require('./errorMiddleware'),
    securityHandlers: {
        Bearer: require('./bearerAuth')
    }
}).apiDoc;
