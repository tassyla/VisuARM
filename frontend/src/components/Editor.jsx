import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const Editor = ({ code, setCode }) => (
  <MonacoEditor
    height="400"
    language="c"
    theme="vs-dark"
    value={code}
    onChange={setCode}
  />
);

export default Editor;
