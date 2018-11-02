'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
    target: 'node',
    externals: [nodeExternals()],
    entry: './server/app.js',
    output: {
        filename: 'app.min.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        })
    ]
});
