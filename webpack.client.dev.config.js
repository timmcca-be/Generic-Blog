'use strict';

const merge = require('webpack-merge');
const common = require('./build/webpack.client.config');

module.exports = merge(common, {
    mode: 'development'
});
