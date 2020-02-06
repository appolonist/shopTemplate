const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const MODE = process.env.MODE || "production"
const app = express();
const config = require('./webpack.config');
const confObj = config(MODE);
const compiler = webpack(confObj);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
    publicPath: confObj.output.publicPath
}));

// Serve the files on port 3000.
app.listen(8080, function () {
    console.log('Example app listening on port 8080!\n');
});

