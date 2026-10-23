const path = require('path');
const webpack = require('webpack');

const PATHS = {
    src: path.join(__dirname, '..', 'src'),
    style: path.join(__dirname, '..', 'src', 'style'),
    build: path.join(__dirname, '..', 'demo', 'dist'),
    demo: path.join(__dirname, '..', 'demo')
};

const config = {
    entry: [PATHS.demo + '/src/js/entry.js'],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    output: {
        path: PATHS.demo + '/dist',
        filename: 'main.js',
        library: 'reactJsonView',
        libraryTarget: 'umd'
    },
    plugins: [],
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss']
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ],
                include: [PATHS.src, PATHS.demo]
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
};

module.exports = config;
