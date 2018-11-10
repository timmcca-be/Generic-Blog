'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./build/webpack.client.config');

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './debug/public')
    }
});
