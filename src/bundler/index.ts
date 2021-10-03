import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

let intialized = false;

const bundle = async (rawCode: string) => {
  if (!intialized) {
    // const wasmURL = 'https://unpkg.com/esbuild-wasm@0.12.28/esbuild.wasm';
    await esbuild.initialize({ worker: true, wasmURL: './esbuild.wasm' });
    intialized = true;
  }

  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  return result.outputFiles[0].text;
};

export default bundle;
