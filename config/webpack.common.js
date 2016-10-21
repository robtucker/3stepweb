const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let extractCSS = new ExtractTextPlugin('[name].css');
let extractSASS = new ExtractTextPlugin('[name].css');

// rather than copy the entire assets folder across
// instead explicitly list the assets we are actually using
// this might be a bit tedious but is probably worth it
let assets = [
    { from: 'assets/img/3step-logo-300.png', to: 'img'},
    { from: 'assets/img/3step-logo-inverted-300.png', to: 'img'}
];

module.exports.WEBPACK_CONFIG = {
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
            { 
                test: /\.css$/, 
                loader: extractCSS.extract(['to-string-loader', 'css']) 
            },
            { 
                test: /\.scss$/, 
                loader: extractSASS.extract(['css','sass']) 
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'file'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '3StepWeb',
            template: 'index.ejs', 
            favicon: '../src/assets/img/favicon.png',
            metas: [
                {"charset": "utf-8"},
                {"name": "author"},
                {"http-equiv": "x-ua-compatible", "content": "ie=edge"},
                {"name": "viewport", "content": "width=device-width, initial-scale=1"}
            ]
        }),
        
        extractCSS,
        extractSASS,

        //new CopyWebpackPlugin(assets, {ignore: ['humans.txt', 'robots.txt']}),

        // copy humans.txt and robots.txt separately
        new CopyWebpackPlugin([
            {from: 'src/assets/robots.txt'}, 
            {from: 'src/assets/humans.txt'}
        ]),

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
