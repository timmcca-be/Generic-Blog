'use strict';

const fs = require('fs');
const path = require('path');
const initServer = require('./initServer');
const app = require('express')();

const folderPath = path.resolve('./api-docs');
const jsonPath = path.resolve(folderPath, 'v1.json');

initServer(app).then((apiDoc) => {
    // uses sync because there's no reason for anything to run concurrently
    if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(jsonPath, JSON.stringify(apiDoc, null, 2), 'utf8');
    console.log('JSON specification saved to ' + jsonPath);
}).catch((e) => {
    console.log(e);
});
