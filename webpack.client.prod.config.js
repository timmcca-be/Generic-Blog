'use strict';

const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./build/webpack.client.config');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.ejs',
            // .. relative to output dir, which is views
            filename: '../views/index.ejs'
        }),
        new ClosureCompilerPlugin({
            compiler: {
                language_in: 'ECMASCRIPT6',
                language_out: 'ECMASCRIPT6',
                compilation_level: 'ADVANCED'
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
});
