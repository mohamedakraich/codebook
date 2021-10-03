import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import bundle from './bundler';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const App = () => {
  const [input, setInput] = useState<string | undefined>('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const output = await bundle(input || 'console.log(123);');
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="console.log(123);"
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
