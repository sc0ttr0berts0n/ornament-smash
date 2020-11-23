const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const uniqueSettings = {
    mode: 'production',
    optimization: {
        minimize: true,
    },
};

// @ts-ignore
module.exports = merge(common, uniqueSettings);
