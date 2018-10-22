'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const readdir = require('util').promisify(fs.readdir);
const Swagger = require('swagger-client');

const url = 'http://localhost:' + process.env.PORT + '/api/v1/api-docs';

readdir(path.resolve(__dirname, './tests')).then(async (testNames) => {
    const tests = testNames.map((name) => {
        const test = require('./tests/' + name);
        test.fileName = name;
        return test;
    });
    try {
        const client = await Swagger(url);
        // Create an account and log into it
        const username = 'test_' + Date.now();
        const password = Date.now() + '';
        const email = Date.now() + "@example.com";
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
                console.log(test.name + ' - passed');
                passed++;
            } catch(err) {
                console.log(test.name + ' - error:');
                if(err instanceof Error) {
                    console.log(err);
                } else {
                    console.log(JSON.stringify(err));
                }
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
    } catch(err) {
        console.log(err);
    }
}).catch((err) => {
    console.log(err)
});
