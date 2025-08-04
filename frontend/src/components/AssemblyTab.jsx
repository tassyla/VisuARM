// components/AssemblyTab.jsx
// Mostra o resultado da compilação, permitindo comparar diferentes níveis de otimização.
import React, { useState } from 'react';

const AssemblyTab = ({ result, onCompile, isLoading }) => {
  const [optLevel1, setOptLevel1] = useState('-O0');
  const [optLevel2, setOptLevel2] = useState('-O2');

  const handleCompareClick = () => {
    onCompile([optLevel1, optLevel2]);
  };

  const optimizationLevels = ['-O0', '-O1', '-O2', '-O3'];

  const OutputPanel = ({ level, data }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex-1">
      <h3 className="text-lg font-bold text-blue-400 mb-2">{level}</h3>
      {!data ? (
         <pre className="text-gray-500 whitespace-pre-wrap text-sm">Ainda não compilado.</pre>
      ) : data.error ? (
         <pre className="text-red-400 whitespace-pre-wrap text-sm">{data.error}</pre>
      ) : (
         <pre className="text-gray-300 whitespace-pre-wrap text-sm font-mono">{data.assembly || 'Ainda não compilado.'}</pre>
      )}
    </div>
  );

  return (
    <div>
      <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap items-center gap-4">
        <span className="text-lg font-semibold">Comparar Níveis de Otimização:</span>
        <div className="flex items-center gap-2">
          <select value={optLevel1} onChange={e => setOptLevel1(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 focus:ring-blue-500 focus:outline-none">
            {optimizationLevels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <span className="text-gray-400">vs</span>
          <select value={optLevel2} onChange={e => setOptLevel2(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 focus:ring-blue-500 focus:outline-none">
            {optimizationLevels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <button
          onClick={handleCompareClick}
          disabled={isLoading}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-500"
        >
          {isLoading ? 'Comparando...' : 'Comparar'}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <OutputPanel level={optLevel1} data={result ? result[optLevel1] : null} />
        <OutputPanel level={optLevel2} data={result ? result[optLevel2] : null} />
      </div>
    </div>
  );
};

export default AssemblyTab;
