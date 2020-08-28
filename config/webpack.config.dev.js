'use strict';

const webpack              = require('webpack');
const merge                = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const express = require('express')
const commonConfig         = require('./webpack.config.common');
const environment          = 
//require('./env/dev.env');
{
    NODE_ENV: 'development'
}
const Path = require('path')
const root = Path.join(__dirname,'..','assets','UI')

const webpackConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: Path.join(root,'dist'),
        publicPath: '/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new webpack.EnvironmentPlugin(environment),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin()
    ],
    devServer: {
        contentBase: Path.join(root,'dist'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        open: true,
        overlay: true,
        port: 8000,
        stats: {
            normal: true
        }
    }
})

const nodemon = require('nodemon')
console.log('nodemon')
nodemon({
    script: Path.join(__dirname,'..','dist','commands','ui','handler','lib','expressApp.js'),
    watch: [Path.join(__dirname,'..','dist','commands','ui','handler','lib'), Path.join(__dirname,'..','config','manladag.config.js')]
})
nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    console.log('App has quit');
    //process.exit();
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });


module.exports = webpackConfig
