'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    entry: './server/app.js',
    output: {
        path: path.resolve(__dirname, './debug'),
        filename: 'app.min.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
        new webpack.SourceMapDevToolPlugin({})
    ]
};
