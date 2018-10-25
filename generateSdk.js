'use strict';

/*
This file is used by the client, but it is pre-compiled by val-loader during
the build process. The client only ever sees the generated code it returns.
*/

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const CodeGen = require('swagger-js-codegen').CodeGen;
const express = require('express');
const app = express();

const initServer = require('./server/initServer');

const paths = path.resolve(__dirname, './server/api-v1/paths');

const services = {};
fs.readdirSync(path.resolve(__dirname, './server/api-v1/services')).forEach((name) => {
    services[name.substring(0, name.length - 3)] = require('./server/api-v1/services/' + name);
});

const apiDoc = initServer(app, paths, services);
const code = CodeGen.getReactCode({
    className: 'Sdk',
    swagger: apiDoc
}).replace("exports.Sdk = Sdk;", "export default new Sdk('/api/v1');");

module.exports = () => { return { code }; }
