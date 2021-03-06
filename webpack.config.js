var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var cssExtractor = new ExtractTextWebpackPlugin('styles/[name].css');
var lifecycleEvent = process.env.npm_lifecycle_event;

// Set file paths
var SRC = './src/app.jsx';
var PUBLIC = __dirname + '/public';

/*
    INITIAL CONFIG
 */

var devConfig = {
    entry: SRC,
    output: {
        publicPath: '/',
        path: PUBLIC,
        filename: 'js/bundle.js'
    },
    devtool: 'source-map',
    module: {
        // Pre Loaders run before the transpiler.  They're great for unit testing, code linting, etc.
		preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                exclude: /node_modules/
            }
        ],
        // Loaders are what manage all of your actual code and assets.
        loaders: [
            {    // CSS/Sass loader config
                test: /\.s?css$/,
                loaders: ['style', 'css', 'postcss', 'sass']
            },
            {    // ES6 loader config
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel']
            },
            {   // Import EJS templates (NOT WORKING ATM)
                test: /\.ejs$/,
                loader: 'ejs-compiled'
            },
            {   // Import images (NOT WORKING ATM)
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=images/[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {   // Import fonts
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loaders: ['file?name=fonts/[name].[ext]']
            }
        ]
    },
    // Post CSS is a nifty plugin for normalizing your styles.  Often times, 3rd-party plugins like this one will require their own config block.
	postcss: [
		autoprefixer({ browsers: ['last 3 versions'] })	// Automatically adds vendor prefixes for x browser versions (and all vendors). :D
	],
    plugins: [
        // HtmlWebpackPlugin is what Automatically injects your styles and javascript into your index.html file.
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './src/views/index.ejs'
        }),
        // We're letting webpack know that we're in a development environment
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"'
		})
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            // Proxy the url /api to an external API.  This way you don't have to install the server on your computer and can get coding faster.
            '/api': {
                target: process.env.API_HOST || 'localhost',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
}

var buildConfig = {
    entry: SRC,
    output: {
        publicPath: '/',
        path: PUBLIC,
        filename: 'js/bundle.js'
    },
    devtool: 'source-map',
    module: {
        // Pre Loaders run before the transpiler.  They're great for unit testing, code linting, etc.
		preLoaders: [
            {
                test: /\.jsx?$/,
                loaders: ['eslint'],
                exclude: /node_modules/
            }
        ],
        // Loaders are what manage all of your actual code and assets.
        loaders: [
            {    // CSS/Sass loader config
                test: /\.s?css$/,
                loader: cssExtractor.extract(['css', 'postcss', 'sass'])
            },
            {    // ES6 loader config
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel']
            },
            {   // Import EJS templates
                test: /\.ejs$/,
                loader: 'ejs-compiled'
            },
            {   // Import images (NOT WORKING ATM)
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=images/[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {   // Import fonts
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loaders: ['file?name=fonts/[name].[ext]']
            }
        ]
    },
    // Post CSS is a nifty plugin for normalizing your styles.  Often times, 3rd-party plugins like this one will require their own config block.
	postcss: [
		autoprefixer({ browsers: ['last 3 versions'] })	// Automatically adds vendor prefixes for x browser versions (and all vendors). :D
	],
    plugins: [
        // HtmlWebpackPlugin is what Automatically injects your styles and javascript into your index.html file.
        new HtmlWebpackPlugin({
            title: 'Webpack Build',
            template: './src/views/index.ejs'
        }),
        // We're letting webpack know that we're in a development environment
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
        new CleanWebpackPlugin(['public/images', 'public/fonts', 'public/js', 'public/styles', 'public/index.ejs']),
        cssExtractor,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            minimize: true
        })
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './public',
        proxy: {
            // Proxy the url /api to an external API.  This way you don't have to install the server on your computer and can get coding faster.
            '/api': {
                target: process.env.API_HOST || 'localhost',
                xfwd: true,
                changeOrigin: true
            }
        }
    }
}

/*
    SELECT WHICH CONFIG TO USE
 */
switch (lifecycleEvent) {
    case 'build':
    module.exports = buildConfig;
    break;
    default:
    module.exports = devConfig;
    break;
}
