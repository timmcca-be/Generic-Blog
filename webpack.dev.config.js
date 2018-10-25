'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

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
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
        new NodemonPlugin(),
        new WebpackShellPlugin({onBuildEnd:['webpack-dev-server --config webpack.client.config.js']})
    ]
};
