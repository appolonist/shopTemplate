require('dotenv').config();
const webpack = require('webpack');
const merge = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");
const glob = require("glob");
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const PATHS = {
    app: path.join(__dirname, "src")
};

const commonConfig = merge([{
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new ErrorOverlayPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            favicon: './src/favicon.png'

        }),
        new WebpackPwaManifest({
            name: 'Karol\'s template shop',
            short_name: 'Shopy',
            description: 'PWA Shopy',
            background_color: '#ffffff',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [
                {
                    src: path.resolve(__dirname, 'src/favicon.png'),
                    sizes: [16, 24, 32, 64, 144, 512] // multiple sizes
                }
            ],
        })],
    devtool: 'cheap-module-source-map',
    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
        ProductList: path.resolve(__dirname, 'src/components/ProductList.js'),
        Details: path.resolve(__dirname, 'src/components/Details.js')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash].js',
        publicPath: '/'

    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    }
}]);

const productionConfig = merge([
    parts.extractCSS({
        use: ["css-loader", parts.autoprefix()]
    }),
    parts.loadJavaScript(),
    parts.optimizeImages(),
    parts.loadImages({
        options: {
            limit: 10 * 1024,
            name: "[name].[ext]",
        },
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
    }),
    parts.loadSVG(),
    parts.loadSCSS()

]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.optimizeImages(),
    parts.loadImages(),
    parts.loadHTML(),
    parts.extractCSS({ use: 'css-loader' }),
    parts.loadJavaScript(),
    parts.loadSVG(),
    parts.loadSCSS()
]);

module.exports = mode => {

    process.env.BABEL_ENV = mode;

    if (mode === "production") {

        return merge(commonConfig, productionConfig, { mode });;
    }
    return merge(commonConfig, developmentConfig, { mode });
};