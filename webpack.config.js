/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

const env = process.env.NODE_ENV;

const common = {
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },

    output: {
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'window',
        libraryExport: 'default',
        library: 'STIntellisense',
        iife: true,
    },
};

const development = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    entry: './public/main.ts',

    output: {
        filename: '[name].js',
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    optimization: {
        minimize: false,
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
    },
});

const production = merge(common, {
    mode: 'production',
    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        filename: 'st-intellisense.min.js',
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'st-intellisense.min.css' })],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
});

module.exports = env === 'production' ? production : development;
