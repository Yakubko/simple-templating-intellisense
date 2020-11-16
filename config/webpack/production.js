/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, '../../lib'),
        filename: 'st-intellisense.min.js',
        library: 'STIntellisense',
        libraryTarget: 'window',
        libraryExport: 'default',
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
