'use strict';

require('dotenv').config();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const app = require('express')();

const initServer = require('./initServer');
const { initDB } = require('./api-v1/shared/db');

app.use(bodyParser.json());
app.use(morgan('dev'));

const serverPromise = initServer(app);
const dbPromise = initDB();

Promise.all([serverPromise, dbPromise]).then(async (data) => {
    const apiDoc = data[0];

    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(apiDoc));

    app.listen(process.env.PORT, function() {
        console.log('Listening on port ' + process.env.PORT);
    });
});
