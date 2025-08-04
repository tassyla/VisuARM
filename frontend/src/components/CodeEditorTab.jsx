// components/CodeEditorTab.jsx
// Contém o editor de código Monaco e o botão para iniciar a compilação.
import React from 'react';
import { Play } from 'lucide-react';
import Editor from '@monaco-editor/react'; // <-- IMPORTAÇÃO ADICIONADA

const CodeEditorTab = ({ code, setCode, onCompile, isLoading }) => {
  const handleCompileClick = () => {
    // Por padrão, compila todos os níveis de otimização
    onCompile(['-O0', '-O1', '-O2', '-O3']);
  };

  return (
    <div className="flex flex-col" style={{ height: '80vh' }}>
      <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height: '70vh' }}>
        {}
        <Editor
          height="100%"
          language="c"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            overviewRulerBorder: false,
          }}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCompileClick}
          disabled={isLoading}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <Play size={20} className="mr-2" />
          {isLoading ? 'Compilando...' : 'Compilar e Executar'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditorTab;