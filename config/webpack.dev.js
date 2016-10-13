const webpack = require('webpack');

const webpackMerge = require('webpack-merge');

const commonConfig = require( "./webpack.common");

const _ = require('lodash');

/**
 * Merge in the development environment variables
 */
const ENV = _.merge(commonConfig.ENV, {
    NODE_ENV: 'development',
    HOST: 'localhost',
    PORT: 3000,
    LOG_LEVEL: 200
});

/**
 * Merge in the development webpack config properties
 */
module.exports = webpackMerge(commonConfig.WEBPACK_CONFIG, {
    plugins: [
        new webpack.DefinePlugin({
            APP_CONFIG: ENV
        })
    ],
    devServer: {
        port: ENV.PORT,
        host: ENV.HOST,
        historyApiFallback: ENV.HISTORY_API_FALLBACK,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
    },
});