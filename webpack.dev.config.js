'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');

const buildPath = path.resolve(__dirname, './debug');

module.exports = {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    entry: './server/app.js',
    output: {
        path: buildPath,
        filename: 'app.min.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    plugins: [
        new CleanWebpackPlugin([buildPath]),
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
        new NodemonPlugin()
    ]
};
