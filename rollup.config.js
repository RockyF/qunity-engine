/**
 * Created by rockyl on 2018/11/16.
 */

const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');
const {uglify} = require('rollup-plugin-uglify');

const name = 'qunity-engine';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: `dist/index.js`,
			format: 'cjs',
		},
		{
			file: `dist/index.es.js`,
			format: 'es',
		},
		{
			file: `dist/index.umd.js`,
			format: 'umd',
			name,
		}
	],
	plugins: [
		resolve({
			browser: true,
		}),
		typescript({
			typescript: require('typescript'),
		}),
		//uglify({}),
	],
	//external: ['qunity-core']
};
