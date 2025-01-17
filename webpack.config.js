const path = require('path');
const fs = require('fs');

const srcJsGeneralDirectory = path.resolve(__dirname, 'src');
const generalEntries = fs.readdirSync(srcJsGeneralDirectory).reduce((entries, file) => {
		if (file.endsWith('.js')) {
			const entryKey = file.replace('.js', '');
			entries[entryKey] = path.resolve(srcJsGeneralDirectory, file);
		}
		return entries;
	}, {});

const generalJs = {
	mode: 'production',
	entry: generalEntries,
	output: {
		filename: '[name].min.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'esbuild-loader',
					options: {
						loader: 'js',
						target: 'es2016',
					},
				},
			},
		],
	},
};

module.exports = [generalJs];
