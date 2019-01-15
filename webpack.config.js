const path = require('path');

module.exports = {
    entry: ['./src/index.ts'],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    }
};