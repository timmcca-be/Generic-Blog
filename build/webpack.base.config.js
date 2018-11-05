'use strict';

const path = require('path');

module.exports = {
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
            },
            {
                test: /\.css$/,
                use: [
                    'isomorphic-style-loader',
                    {
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            sdk$: path.resolve(__dirname, './generateSdk.js'),
            shared: path.resolve(__dirname, '../client/shared')
        }
    }
};
