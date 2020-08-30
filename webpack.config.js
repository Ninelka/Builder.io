const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
	src: path.join(__dirname, "./src"),
	dist: path.join(__dirname, "./dist"),
	assets: "assets/",
};

const PAGES_DIR = `${PATHS.src}/html/pages/`;
const PAGES = fs
	.readdirSync(PAGES_DIR)
	.filter((fileName) => fileName.endsWith(".pug"));

module.exports = {
	entry: ["./src/js/index.js", "./src/scss/style.scss"],
	output: {
		filename: "./js/bundle.js",
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: "pug-loader",
				options: {
					pretty: true,
				},
			},
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "src/js"),
				use: {
					loader: "babel-loader",
					options: {
						presets: ["env"],
					},
				},
			},
			{
				test: /\.scss$/,
				include: path.resolve(__dirname, "src/scss"),
				use: [
					"style-loader",
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: { sourceMap: true, url: false },
					},
					{
						loader: "sass-loader",
						options: { sourceMap: true },
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "src/css/style.bundle.css",
			allChunks: true,
		}),
		...PAGES.map(
			(page) =>
				new HtmlWebpackPlugin({
					template: `${PAGES_DIR}/${page}`,
					filename: `./${page.replace(/\.pug/, ".html")}`,
				})
		),
	],
};