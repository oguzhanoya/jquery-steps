import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const now = new Date();

export default {
  external: ['jquery'],
  input: 'src/Plugin.js',
  output: {
    file: 'dist/jquery-steps.js',
    format: 'umd',
    name: 'Steps',
    banner: `/*!
    * Steps v${pkg.version}
    * ${pkg.repository.url.replace('.git', '')}
    *
    * Copyright (c) ${now.getFullYear()} ${pkg.author}
    * Released under the ${pkg.license} license
    */
    `,
    globals: {
      jquery: '$',
    },
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      babelrc: false,
    }),
    json({
      exclude: 'node_modules/**',
    }),
  ],
};
