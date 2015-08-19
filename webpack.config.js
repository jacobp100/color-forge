'use strict';

module.exports = {
	context: __dirname,
	entry: './index',
	devtool: 'source-map',
	output: {
		filename: 'bundle.js',
		library: 'colorForge',
		libraryTarget: 'var'
	},
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	}
};
