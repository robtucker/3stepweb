const webpack = require('webpack');

const helpers = require('./helpers');

const colors = require('colors');

/**
 * Set environment variables
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

const HOST = process.env.HOST = 'localhost';

const PORT = process.env.PORT = 3000;

const APP_GLOBALS = helpers.mergeEnvironment({
    ENV: ENV,
    HOST: HOST
});

//console.log(APP_GLOBALS);

/**
 * Merge in the development webpack config properties
 */
const WEBPACK_CONFIG = helpers.mergeWebpackConfig({
    plugins: [
        new webpack.DefinePlugin(helpers.configureAppGlobals(APP_GLOBALS))
    ],
    devServer: {
        port: PORT,
        host: HOST,
        historyApiFallback: APP_GLOBALS.HISTORY_API_FALLBACK,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
    },
});

//console.log(WEBPACK_CONFIG);

module.exports = WEBPACK_CONFIG;