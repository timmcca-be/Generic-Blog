'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const util = require('util');
const Swagger = require('swagger-client');
const serverPromise = require('./app');

const url = 'http://localhost:' + process.env.PORT + '/api/v1/json-docs';
const testsPromise = new Promise(async (resolve, reject) => {
    const fileNames = await util.promisify(fs.readdir)(path.resolve(__dirname, './tests'));
    resolve(fileNames.map((name) => {
        const test = require('./tests/' + name);
        test.fileName = name;
        return test;
    }));
});

Promise.all([serverPromise, testsPromise]).then(async (data) => {
    const server = data[0];
    const tests = data[1];
    try {
        console.log();
        const client = await Swagger(url);
        // Create an account and log into it
        const username = 'test_' + Date.now();
        const password = Date.now() + '';
        const email = Date.now() + "@example.com";
        console.log(email);
        const accountResponse = await client.apis.auth.createAccount({
            user: {
                username,
                password,
                email
            }
        });
        const token = accountResponse.body.token;
        const authClient = await Swagger(url, {
            requestInterceptor: (req) => {
                req.headers['Authorization'] = 'Bearer ' + token;
                return req;
            }
        });
        console.log();
        let passed = 0;
        const failing = [];
        for(let i = 0; i < tests.length; i++) {
            const test = tests[i];
            try {
                if(test.auth) {
                    await test.run(authClient, username, password, email);
                } else {
                    await test.run(client, username, password, email);
                }
                console.log('\n' + test.name + ' - passed\n');
                passed++;
            } catch(e) {
                console.log('\n' + test.name + ' - error:');
                if(e instanceof Error) {
                    console.log(e);
                } else {
                    console.log(JSON.stringify(e));
                }
                console.log();
                failing.push(test.name + ' (' + test.fileName + ')');
            }
        }
        console.log(passed + ' / ' + tests.length + ' passed');
        if(failing.length > 0) {
            console.log('Failing tests:');
            failing.forEach((name) => {
                console.log(name);
            });
        }
    } catch(e) {
        console.log(e);
    }
    server.close(() => {
        process.exit();
    });
}).catch((e) => {
    console.log(e)
});
