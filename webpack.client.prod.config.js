'use strict';

const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const merge = require('webpack-merge');
const common = require('./build/webpack.client.config');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, './dist/public')
    },
    plugins: [
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
