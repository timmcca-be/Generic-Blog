module.exports = {
    login,
    createUser
};

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { InvalidCredentialsError, NotUniqueError } = require('../shared/errors');

function loginToken(id, username) {
    // create token of type login - in the future, account activation and password reset tokens will also be used, and these need to be easily distinguishable from each other
    return { token: jwt.sign({ userId: id, username, type: 'login' }, process.env.TOKEN_SECRET, { expiresIn: '1d' }) };
}

function login(dbService, username, password) {
    const query = {
        type: 'select',
        table: 'users',
        fields: [
            'id',
            'username',
            'password',
            'salt'
        ],
        condition: { username }
    };
    return dbService.queryOne(query).then(row => {
        if(!row) {
            // username does not exist
            throw new InvalidCredentialsError();
        }
        const hash = crypto.createHash('sha256').update(password + row.salt).digest('base64');
        if(hash !== row.password) {
            // invalid password
            throw new InvalidCredentialsError();
        }
        return loginToken(row.id, row.username);
    });
}

function createUser(dbService, username, password, email) {
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
    return dbService.queryOne(query).then(result => {
        return loginToken(result.id, username);
    }).catch(err => {
        if(err.code === '23505') {
            throw new NotUniqueError(err.detail);
        }
        throw err;
    });
}
