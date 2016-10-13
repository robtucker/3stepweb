const webpack = require('webpack');

const webpackMerge = require('webpack-merge');

const commonConfig = require( "./webpack.common");

const _ = require('lodash');

/**
 * Merge in the production environment variables
 */
const ENV = _.merge(commonConfig.ENV, {
    NODE_ENV: 'production',
    LOG_LEVEL: 0
});

/**
 * Merge in the development webpack config properties
 */
module.exports = webpackMerge(commonConfig.WEBPACK_CONFIG, {
    plugins: [
        new webpack.DefinePlugin({
            APP_CONFIG: ENV
        })
    ]
});