const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let extractCSS = new ExtractTextPlugin('css/[name].css');
let extractSASS = new ExtractTextPlugin('css/[name].css');

const APP_GLOBALS = exports.APP_GLOBALS = {
    HISTORY_API_FALLBACK: true,
    LOG_LEVEL: 100,
};

const WEBPACK_CONFIG = exports.WEBPACK_CONFIG = {
    context: process.env.NODE_PATH + "/src",
    entry: {
        main: "./main.ts",
        materials: './materials.ts',
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
                exclude: /node_modules\/!(material2)/,
                loaders: ["awesome-typescript-loader", "angular2-router-loader", "angular2-template-loader"]
            },
            { test: /\.css$/, loader: extractCSS.extract(['to-string-loader', 'css']) },
            { test: /\.scss$/, loader: extractSASS.extract(['css','sass']) },
            // {
            //     test: /\.scss$/,
            //     loader: ExtractTextPlugin.extract("style", "css!sass")
            // },
            //{ test: /\.css$/, loaders: ['to-string-loader', 'css-loader'] }
            // {
            //     test: /\.css$/,
            //     loader: ExtractTextPlugin.extract({
            //         fallbackLoader: "style-loader",
            //         loader: "css-loader"
            //     })
            // }
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
        
        extractCSS,
        extractSASS,

        new CopyWebpackPlugin(
            [{ from: 'src/assets', to: 'img' }], //pattern
            {ignore: ['humans.txt', 'robots.txt']} //options
            ),

        // copy humans.txt and robots.txt separately
        new CopyWebpackPlugin([{ from: 'src/img', to: 'img' }]),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        // modify angular material design github repo so that it asks for the sass file not the css file
        // new webpack.NormalModuleReplacementPlugin(/\.css$/, function(result) {
        //     result.request = result.request.replace(/\.\/(.+)\.css/, '@angular/material/$1/$1.css');
        //     console.log(result.request);
        // }),
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html']
    }
}
