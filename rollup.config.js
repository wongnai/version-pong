// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: {
    file: pkg.main,
    format: 'cjs',
    banner: '#!/usr/bin/env node',
  },
  plugins: [typescript(/*{ plugin options }*/)],
}
