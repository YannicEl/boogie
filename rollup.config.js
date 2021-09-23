import esbuild from 'rollup-plugin-esbuild';

export default [
	{
		input: 'src/main.ts',
		output: {
			file: 'dist/main.js',
			format: 'es',
		},
		plugins: [esbuild()],
	},
	{
		input: 'src/deploy-commands.ts',
		output: {
			file: 'dist/deploy-commands.js',
			format: 'es',
		},
		plugins: [esbuild()],
	},
];
