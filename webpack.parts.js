const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");


exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host: process.env.HOST, // set "localhost"
        port: process.env.PORT,
        contentBase: './src', // set 8080, for docker, vagrant change to 0.0.0.0 in .env file. 
        historyApiFallback: true, // enable HTML5 history api based routing
        overlay: true, //WDS overlay does not capture runtime errors of the application!!
        open: 'chrome', // open the page in browser
        hot: true
    },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,

                use: ["style-loader", "css-loader"],
            },
        ],
    },
});

exports.extractCSS = ({ include, exclude, use = [] }) => {
    // Output extracted CSS to a file
    const plugin = new MiniCssExtractPlugin({
        filename: "[name].css",
    });

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,

                    use: [
                        MiniCssExtractPlugin.loader,
                    ].concat(use),
                },
            ],
        },
        plugins: [plugin],
    };
};

exports.purifyCSS = ({ paths }) => ({
    plugins: [new PurifyCSSPlugin({ paths })],
});

exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()],
    },
});
exports.optimizeImages = () => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                loader: "image-webpack-loader",
                enforce: 'pre'
            }
        ]
    }
})
exports.loadSCSS = () => ({
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
})
exports.loadImages = ({ include, exclude, options } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                include: /img/,
                exclude,
                use: {
                    loader: "url-loader",
                    options,
                },
            },
        ],
    },
});
exports.loadSVG = ({ include } = {}) => ({
    module: {
        rules: [
            {
                test: /\.svg$/,
                include,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: "react-svg-loader",
                        options: {
                            jsx: true
                        }

                    }
                ]

            },
        ],
    },

});
exports.loadJavaScript = ({ include } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env",
                            "@babel/preset-react"]
                    }
                },
            },
        ],
    },

});
exports.loadHTML = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.html$/,
                include,
                exclude,
                use: "html-loader",
            },
        ],
    },
});

exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()],
    },
});
