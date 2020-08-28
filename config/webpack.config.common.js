'use strict';

const VueLoaderPlugin      = require('vue-loader/lib/plugin')
const {  VuetifyLoaderPlugin }      = require('vuetify-loader')
const HtmlPlugin           = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const isDev                = process.env.NODE_ENV === 'development'
const Path = require('path')
const root = Path.join(__dirname,'..','assets','UI')

const webpackConfig = {
    entry: {
        polyfill: '@babel/polyfill/noConflict',
        main: Path.join(root,'src','index'),
    },
    resolve: {
        extensions: [ '.js', '.vue' ],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
            '@': Path.join(root,'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ Path.join(root,'src') ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [ Path.join(root,'src')]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      outputPath: 'fonts/'
                    }
                  }
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    isDev ?'style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                    { 
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev,
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true // optional
                            },
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    isDev ?'style-loader' : MiniCSSExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: isDev } },
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin(),
        new HtmlPlugin({
            title: 'dj',
            chunksSortMode: 'auto',
            filename: Path.join(root,'dist','index.html'),
            template: Path.join(root,'src','index.html')
        })
    ]
}

module.exports = webpackConfig