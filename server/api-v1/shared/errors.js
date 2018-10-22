'use strict';

class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid credentials');
        this.name = 'InvalidCredentialsError';
    }
}

class NotUniqueError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotUniqueError';
    } 
}

module.exports = {
    InvalidCredentialsError,
    NotUniqueError
};
