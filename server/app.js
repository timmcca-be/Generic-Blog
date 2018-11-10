require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const preactRenderToString = require("preact-render-to-string");
import { h, Component } from 'preact';
import ContextWrapper from '../client/ContextWrapper';

const initServer = require('./initServer');
const dbService = require('./api-v1/services/dbService');

app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('view engine', 'ejs');

// routes and services are dynamically loaded from filesystem through webpack

const pathContext = require.context('./api-v1/paths', true, /\.js$/);
const paths = pathContext.keys().map(key => {
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
        module: pathContext(key)
    }
});

const serviceContext = require.context('./api-v1/services', true, /\.js$/);
const services = {};
serviceContext.keys().forEach(key => {
    const fileName = path.basename(key);
    // chop off ending '.js'
    const serviceName = fileName.substring(0, fileName.length - 3);
    services[serviceName] = serviceContext(key);
});

const apiDoc = initServer(app, paths, services);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(apiDoc));

app.use(express.static((process.env.NODE_ENV === 'development' ? 'debug' : 'dist') + '/public'));

app.get('/', (req, res) => {
    const css = new Set();
    const context = { insertCss: (...styles) => styles.forEach(style => css.add(style._getCss())) };
    res.render('index.ejs', {
        body: preactRenderToString(<ContextWrapper context={context} />),
        styles: [...css].join(''),
        refreshScript: process.env.NODE_ENV === 'development' ? '<script src="' + process.env.BROWSER_REFRESH_URL + '"></script>' : ''
    });
});

dbService.initDB().then(client => {
    app.listen(process.env.PORT, function() {
        console.log('Listening on port ' + process.env.PORT);
        if (process.send) {
            process.send('online');
        }
    });
});
