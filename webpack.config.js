var path = require('path');
var HtmlWebpackPlugtin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/index.jsx',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'index_bundle.js'
    },

    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader'},
            { test: /\.(jsx)$/, use: 'babel-loader'},
            { test: /\.(css)$/, use: ['style-loader', 'css-loader']},
        ]
    },

    plugins: [
        new HtmlWebpackPlugtin({
            template: 'src/index.html'
        }),
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: 'src/images', to: 'images' },
            { from: 'src/styles', to: 'styles' }])
        ]
}
