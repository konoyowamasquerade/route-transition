import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

// import pcg from './package.json' assert { type: 'json' };

const input = './src/main.ts';
const inputUmd = './src/umd.ts';
const stylesInput = './src/styles.ts';

const terserOptions = {
  compress: { drop_console: true },
  output: { comments: false },
};

const swcUmdOptions = {
  tsconfig: './tsconfig.umd.json',
  jsc: {
    externalHelpers: false,
  },
};

const postcssOptions = {
  minimize: true,
};

// separately transpile and type-checking + declaration
export default [
  {
    input,
    output: [
      {
        file: `./dist/index.js`,
        format: 'es',
        sourcemap: true,
      },
    ],

    plugins: [swc()],
  },
  {
    input,
    output: [
      {
        file: `./dist/index.min.js`,
        plugins: [terser(terserOptions)],
        format: 'es',
      },
    ],
    plugins: [swc()],
  },
  {
    input: inputUmd,
    output: [
      {
        file: `./dist/index-umd.min.js`,
        plugins: [terser(terserOptions)],
        format: 'umd',
        name: 'RouteTransition',
      },
    ],
    plugins: [swc(swcUmdOptions)],
  },

  // type-checking + declarations
  {
    input,
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      dts({
        tsconfig: './tsconfig.dts.json',
      }),
    ],
  },

  {
    input: stylesInput,
    output: [
      {
        file: `./dist/styles.min.css`,
        format: 'es',
      },
    ],
    plugins: [postcss({ ...postcssOptions, extract: true })],
  },
];
