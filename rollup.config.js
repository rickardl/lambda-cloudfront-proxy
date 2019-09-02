import typescript from 'rollup-plugin-typescript';
import {
  eslint
} from "rollup-plugin-eslint";
import {
  terser
} from "rollup-plugin-terser";

const lambdas = ['origin-request', 'origin-response', 'viewer-request'];

export default lambdas.map(name => {
  return {
    input: `src/example/handlers/${name}.ts`,
    output: {
      format: 'cjs',
      file: `dist/${name}.js`
    },
    plugins: [typescript(), terser(), eslint()]
  };
});