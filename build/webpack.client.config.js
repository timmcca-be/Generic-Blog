'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: 'index.min.js',
        chunkFilename: '[name].bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.ejs',
            // .. relative to output dir, which is public
            filename: '../views/index.ejs'
        })
    ]
});
