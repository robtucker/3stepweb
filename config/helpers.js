const webpackMerge = require('webpack-merge');
const colors = require('colors');
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

    console.log(`Merging environment variables for: ${environment.ENV}`.green);

    let isProd = (environment.ENV == 'production') || (environment.ENV == 'prod');
    let commonGlobals = require(`./globals/common.json`);
    let environmentGlobals = require(`./globals/${environment.ENV}.json`);
    console.log(environmentGlobals);


    return webpackMerge(commonGlobals, environmentGlobals, environment, { IS_PROD: isProd });
};

/**
 * format the app globals for the DefinePlugin
 */
exports.configureAppGlobals = function(globals) {
    return {
        'process.env': JSON.stringify(globals)
    }
};