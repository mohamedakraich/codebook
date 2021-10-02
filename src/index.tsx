import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const [input, setInput] = useState<string | undefined>('');
  const [code, setCode] = useState('');

  // const wasmURL = 'https://unpkg.com/esbuild-wasm@0.12.28/esbuild.wasm';
  const initEsbuild = async () => {
    await esbuild.initialize({ worker: true, wasmURL: './esbuild.wasm' });
  };

  const onClick = async () => {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: { 'process.env.NODE_ENV': '"production"' },
    });
    setCode(result.outputFiles[0].text);
  };

  useEffect(() => {
    initEsbuild();
  }, []);

  return (
    <div>
      <CodeEditor
        initialValue="const a = 2;"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
