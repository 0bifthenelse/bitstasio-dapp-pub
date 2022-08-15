const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const settings = require('./webpack.settings.json');

// determine if we are in development or production mode
const dev = process.env.NODE_ENV !== 'production';

// use index.html (in /src/html/ directory) as the template
// output to index.html (in the <outDir> directory)
// https://github.com/jantimon/html-webpack-plugin
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	filename: settings.html.filename,
	hash: dev ? false : true,
	inject: true,
	meta: settings.html.meta,
	template: settings.html.template,
	title: settings.html.title
});

// Used to set mode to production in plugins below.
const DefinePluginConfig = new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify('production'),
});

// path of our tsx entry point
const indexPath = path.join(__dirname, settings.input.entry);

module.exports = {
	devServer: {
		contentBase: path.join(__dirname, settings.output.directory),
		host: settings.devServer.host,
		port: settings.devServer.port,
		hot: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		historyApiFallback: true,
	},
	entry: dev ? ['react-hot-loader/patch', indexPath] : [indexPath],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'babel-loader',
			},
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
				loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader',
			},
			{
				test: /\.css$/,
				loader: 'css-loader',
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'url-loader',
				options: {
					limit: 10000,
				},
			},
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: "javascript/auto"
			}
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			utils: path.resolve(__dirname, 'src/ts/utils'),
			slice: path.resolve(__dirname, 'src/ts/redux/slice'),
			store: path.resolve(__dirname, 'src/ts/redux/store'),
			constant: path.resolve(__dirname, 'src/ts/constant'),
		}
	},
	node: {
		fs: 'empty',
		path: 'empty'
	},
	output: {
		filename: settings.output.file,
		path: path.join(__dirname, settings.output.directory),
		publicPath: '/'
	},
	mode: dev ? 'development' : 'production',
	plugins: dev
		? [HTMLWebpackPluginConfig, new webpack.HotModuleReplacementPlugin()]
		: [HTMLWebpackPluginConfig, DefinePluginConfig],
};