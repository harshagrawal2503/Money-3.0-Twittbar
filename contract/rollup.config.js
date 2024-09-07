import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import dotenv from 'dotenv';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import strato from '@buidlerlabs/rollup-plugin-hedera-strato';

dotenv.config({ path: './.env' });

export default async function getConfig() {
  return {
    context: 'window',
    input: './src/index.ts',
    output: [ {
      file: './dist/hedera-strato-hashpack-esm.js',
      format: 'esm',
      sourcemap: true,
    } ],
    plugins: [
      strato({ 
        includeCompiler: true,
        sourceMap: true, 
      }),
      resolve({
        extensions: [ '.js', '.ts' ],
        mainFields: [ "browser", "module", "main" ],
        preferBuiltins: false,
      }),
      commonjs({
        esmExternals: true,
        requireReturnsDefault: "preferred",
      }),
      nodePolyfills({
        sourceMap: true,
      }),
      babel({
        babelHelpers: "runtime",
        extensions: [".ts"],
        plugins: [["@babel/plugin-transform-runtime", { regenerator: true }]],
        presets: [
          ["@babel/env", { targets: "> 0.25%, not dead" }],
          ["@babel/typescript"],
        ],
      }),
      json(),
    ],
    treeshake: true,
  }
}
