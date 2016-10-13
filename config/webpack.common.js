const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const APP_GLOBALS = exports.APP_GLOBALS = {
    HISTORY_API_FALLBACK: true,
    LOG_LEVEL: 100,
};

const WEBPACK_CONFIG = exports.WEBPACK_CONFIG = {
    context: process.env.NODE_PATH + "/src",
    entry: {
        main: "./main.ts",
        vendor: "./vendor.ts",
        polyfills: "./polyfills"
    },
    output: {
        path: process.env.NODE_PATH + "/dist",
        filename: "scripts/[name].js"
    },
    module:  {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            { 
                test: /\.ts$/, 
                exclude: /node_modules/,
                loaders: ["awesome-typescript-loader", "angular2-router-loader", "angular2-template-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css-loader!postcss-loader')
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'CoderLab',
            template: 'index.ejs', 
            metas: [
                {"charset": "utf-8"},
                {"name": "author"},
                {"http-equiv": "x-ua-compatible", "content": "ie=edge"},
                {"name": "viewport", "content": "width=device-width, initial-scale=1"}
            ]
        }),
        
        new ExtractTextPlugin("[name].css"),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html']
    }
}
