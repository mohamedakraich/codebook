import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import CodeEditor from './components/code-editor';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const iframeRef = useRef<any>();
  const [input, setInput] = useState<string | undefined>('');

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch(error) {
              const root = document.querySelector("#root");
              root.innerHTML = '<div style="color:red;"><h4>Runtime error:</h4>' + error + '</div>';
              console.error(error);
            }    
          }, false);
        </script>
      </body>
    </html>
`;

  // const wasmURL = 'https://unpkg.com/esbuild-wasm@0.12.28/esbuild.wasm';
  const initEsbuild = async () => {
    await esbuild.initialize({ worker: true, wasmURL: './esbuild.wasm' });
  };

  const onClick = async () => {
    iframeRef.current.srcdoc = html;

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: { 'process.env.NODE_ENV': '"production"' },
    });

    iframeRef.current.contentWindow?.postMessage(
      result.outputFiles[0].text,
      '*'
    );
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={html}
        title="CodePreviewIframe"
      ></iframe>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
