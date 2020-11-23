const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const uniqueSettings = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 9000,
        host: '192.168.1.192',
    },
};

// @ts-ignore
module.exports = merge(common, uniqueSettings);
