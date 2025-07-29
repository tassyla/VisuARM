import React, { useState } from 'react';
import Editor from './components/Editor';
import OutputView from './components/OutputView';

function App() {
  const [code, setCode] = useState('int main() { return 42; }');
  const [assembly, setAssembly] = useState('');

  const compile = async () => {
    const res = await fetch('http://localhost:5000/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, opt_level: '-O0' })
    });

    const data = await res.json();
    if (data.status === 'success') setAssembly(data.assembly);
    else alert('Erro: ' + data.error);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>VisuARM</h1>
      <Editor code={code} setCode={setCode} />
      <button onClick={compile} style={{ margin: '10px 0' }}>Compilar</button>
      <OutputView assembly={assembly} />
    </div>
  );
}

export default App;
