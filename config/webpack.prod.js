const webpack = require('webpack');

const helpers = require('./helpers');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

/**
 * Merge in the development environment variables
 */
const APP_GLOBALS = helpers.mergeEnvironment({
    ENV: ENV,
    LOG_LEVEL: 300
});

/**
 * Merge in the development webpack config properties
 */
module.exports = helpers.mergeWebpackConfig({
    plugins: [
        new webpack.DefinePlugin(helpers.configureAppGlobals(APP_GLOBALS))
    ]
});