const path = require('path');

module.exports = {
    entry: ['./src/ts/index.ts', './src/scss/style.scss'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    // loads scss
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'css',
                            name: 'style.css',
                        },
                    },
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    target: 'web',
};
