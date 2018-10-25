'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

const buildPath = path.resolve(__dirname, './public');

module.exports = {
    mode: 'production',
    entry: {
        client: './client/index.js'
    },
    output: {
        path: buildPath,
        filename: 'index.min.js',
        chunkFilename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: require.resolve('./generateSdk.js'),
                use: {
                    loader: 'val-loader'
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    resolve: {
        alias: {
            sdk$: path.resolve(__dirname, './generateSdk.js')
        }
    },
    devServer: {
        port: 3000,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html'
        }),
        new ExtraWatchWebpackPlugin({
            files: [ './debug/app.min.js' ],
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
