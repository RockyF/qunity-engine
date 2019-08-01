/**
 * Created by rockyl on 2018/11/16.
 */

const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');

export default {
	output: {
		format: 'umd',
		sourcemap: true,
		globals: {
			'qunity-core': 'qunity-core'
		},
	},
	plugins: [
		resolve({
			browser: true,
		}),
		typescript({
			typescript: require('typescript'),
			include: ['**/*.ts+(|x)', '../src/**/*.ts+(|x)',]
		}),
	],
	external: ['qunity-core'],
};
