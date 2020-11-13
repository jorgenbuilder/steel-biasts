const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        game: './src/index.ts'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Steel Biasts'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
                include: [path.resolve(__dirname, './src'),],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                // Images
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                // Font
                test: /\.(ttf|xml|fnt|tga)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                // Sound
                test: /\.(ogg)$/,
                use: [
                    'file-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.json'],
        alias: {
            animations: path.resolve(__dirname, 'src/animations/'),
            assets: path.resolve(__dirname, 'src/assets/'),
            scenes: path.resolve(__dirname, 'src/scenes/'),
            sprites: path.resolve(__dirname, 'src/sprites/'),
            helpers: path.resolve(__dirname, 'src/helpers/'),
            managers: path.resolve(__dirname, 'src/managers/'),
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};