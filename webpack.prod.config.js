'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()],
    entry: './server/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.min.js'
    },
    plugins: [
        new ClosureCompilerPlugin({
            compiler: {
                language_in: 'ECMASCRIPT6',
                language_out: 'ECMASCRIPT6',
                compilation_level: 'ADVANCED'
            },
            concurrency: 3,
        })
    ],
    optimization: {
        minimize: false
    }
};
