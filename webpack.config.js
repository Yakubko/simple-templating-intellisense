/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const env = process.env.NODE_ENV;

module.exports = {
    mode: env === 'production' ? 'production' : 'development',
    devtool: env === 'production' ? 'source-map' : 'inline-source-map',

    entry: env === 'production' ? './src/index.ts' : './public/main.ts',
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },

    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: env === 'production' ? 'autocomplete.min.js' : '[name].js',
        libraryTarget: 'window',
        libraryExport: 'default',
        library: 'Autocomplete',
        iife: true,
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'autocomplete.min.css' })],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [`...`, new CssMinimizerPlugin()],
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
    },
};
