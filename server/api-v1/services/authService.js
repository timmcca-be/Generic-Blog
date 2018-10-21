'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const InvalidCredentialsError = require('../shared/InvalidCredentialsError');
const { queryOne } = require('../shared/db');

module.exports = {
    async login(username, password) {
        const query = {
            type: 'select',
            table: 'users',
            fields: [
                'id',
                'password',
                'salt'
            ],
            condition: { username }
        };
        const row = await queryOne(query);
        if(!row) {
            // username does not exist
            throw new InvalidCredentialsError();
        }
        const hash = crypto.createHash('sha256').update(password + row.salt).digest('base64');
        if(hash !== row.password) {
            // invalid password
            throw new InvalidCredentialsError();
        }
        // create token of type login - in the future, account activation and password reset tokens will also be used, and these need to be easily distinguishable from each other
        const token = jwt.sign({userId: row.id, type: 'login'}, process.env.TOKEN_SECRET, {expiresIn: '1d'});
        return { token };
    },
    async createUser(username, password, email) {
        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto.createHash('sha256').update(password + salt).digest('base64');
        const query = {
            type: 'insert',
            table: 'users',
            values: {
                username,
                password: hash,
                salt,
                email
            },
            returning: ['id']
        };
        const result = await queryOne(query);
        const token = jwt.sign({userId: result.id, type: 'login' }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        return { token }
    }
}
