const webpackMerge = require('webpack-merge');

const commonConfig = require( "./webpack.common");

/**
 * merge a webpack config object with the common config
 */
exports.mergeWebpackConfig = function(config) {
    return webpackMerge(commonConfig.WEBPACK_CONFIG, config);
}

/**
 * merge env variables with the common env variables
 */
exports.mergeEnvironment = function(environment) {

    if(!environment || !environment.ENV) {
        throw new Error("The environment does not contain an ENV property");
    }

    let isProd = (environment.ENV == 'production') || (environment.ENV == 'prod');

    let globals = require(`./globals/${environment.ENV}.json`);

    return webpackMerge(commonConfig.APP_GLOBALS, environment, globals, { IS_PROD: isProd });
};

/**
 * format the app globals for the DefinePlugin
 */
exports.configureAppGlobals = function(globals) {
    return {
        'process.env': JSON.stringify(globals)
    }
};