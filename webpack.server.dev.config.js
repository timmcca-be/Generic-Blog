'use strict';

const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const merge = require('webpack-merge');
const common = require('./build/webpack.server.config');

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './debug')
    },
    plugins: [
        new WebpackShellPlugin({onBuildEnd:['nodemon debug/app.min.js', 'webpack-dev-server --config webpack.client.dev.config.js --hot']})
    ],
    optimization: {
        minimize: false
    },
    devtool: 'source-map'
});
