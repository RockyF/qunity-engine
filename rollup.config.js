/**
 * Created by rockyl on 2018/11/16.
 */

const typescript = require('rollup-plugin-typescript');
const {uglify} = require('rollup-plugin-uglify');

const name = 'qunity-core';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: `dist/index.cjs.js`,
			format: 'cjs',
		},
		{
			file: `dist/index.es.js`,
			format: 'es',
		},
		{
			file: `dist/index.js`,
			format: 'umd',
			name,
		}
	],
	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
		//uglify({}),
	]
};
