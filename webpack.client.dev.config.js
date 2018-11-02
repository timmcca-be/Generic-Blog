'use strict';

const path = require('path');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./build/webpack.client.config');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    plugins: [
        new ExtraWatchWebpackPlugin({
            files: [ './debug/app.min.js' ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './client/index.ejs'),
            filename: 'index.html'
        })
    ]
});
