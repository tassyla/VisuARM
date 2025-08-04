// App.jsx
// O componente principal que organiza toda a aplicação.
// Ele gerencia o estado global, como o código C, os resultados da compilação
// e a aba ativa, passando essas informações para os componentes filhos.

import React, { useState, useCallback } from 'react';
import { Cpu, FileDown, BookCopy, MemoryStick, Github, Code, Settings2 } from 'lucide-react';

// Componentes para cada aba
import Header from './components/Header';
import CodeEditorTab from './components/CodeEditorTab';
import AssemblyTab from './components/AssemblyTab';
import MemoryTab from './components/MemoryTab';
import FilesTab from './components/FilesTab';

// Adicione o link para o Tailwind CSS no seu index.html:
// <script src="https://cdn.tailwindcss.com"></script>

function App() {
  // Estado para a aba ativa
  const [activeTab, setActiveTab] = useState('code');
  
  // Estado para o código C do editor
  const [code, setCode] = useState('// Escreva seu código C aqui\n\nint main() {\n  int a = 10;\n  int b = 22;\n  return a + b;\n}');
  
  // Estado para armazenar os resultados da compilação
  const [compilationResult, setCompilationResult] = useState({
    O0: { assembly: '', files: [], error: null },
    O1: { assembly: '', files: [], error: null },
    O2: { assembly: '', files: [], error: null },
    O3: { assembly: '', files: [], error: null },
  });
  
  // Estado para o carregamento
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para a mensagem de erro
  const [errorMessage, setErrorMessage] = useState('');

  // Função para compilar o código
  // Usamos useCallback para evitar recriações desnecessárias da função
  const handleCompile = useCallback(async (optLevels) => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Função auxiliar para uma única chamada à API
    const compileRequest = async (optLevel) => {
      try {
        const response = await fetch('http://localhost:5000/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, opt_level: optLevel }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Erro de comunicação com o servidor.' }));
            return { assembly: '', files: [], error: errorData.error || `Erro HTTP: ${response.status}` };
        }
        const data = await response.json();
        if (data.status === 'success') {
          return { assembly: data.assembly, files: data.files || [], error: null };
        } else {
          return { assembly: '', files: [], error: data.error };
        }
      } catch (error) {
        console.error("Compilation fetch error:", error);
        return { assembly: '', files: [], error: 'Falha ao conectar com o backend. Verifique se ele está rodando.' };
      }
    };

    // Executa as compilações em paralelo
    const results = await Promise.all(optLevels.map(opt => compileRequest(opt)));
    
    // Atualiza o estado com os novos resultados
    setCompilationResult(prev => {
      const newState = { ...prev };
      let firstError = '';
      results.forEach((result, index) => {
        const opt = optLevels[index];
        newState[opt] = result;
        if (result.error && !firstError) {
          firstError = `Erro na otimização ${opt}: ${result.error}`;
        }
      });
      if(firstError) setErrorMessage(firstError);
      return newState;
    });

    setIsLoading(false);
    
    // Se a compilação foi bem-sucedida, muda para a aba de Assembly
    if (!errorMessage && results.some(r => !r.error)) {
        setActiveTab('assembly');
    }
  }, [code]); // Depende apenas do 'code'

  // Renderiza o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'code':
        return <CodeEditorTab code={code} setCode={setCode} onCompile={handleCompile} isLoading={isLoading} />;
      case 'assembly':
        return <AssemblyTab result={compilationResult} onCompile={handleCompile} isLoading={isLoading} />;
      case 'memory':
        return <MemoryTab />;
      case 'files':
        return <FilesTab result={compilationResult} />;
      default:
        return <CodeEditorTab code={code} setCode={setCode} onCompile={handleCompile} isLoading={isLoading} />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        {errorMessage && (
            <div className="bg-red-800 border border-red-600 text-white px-4 py-3 rounded-lg relative mb-4" role="alert">
                <strong className="font-bold">Ocorreu um erro! </strong>
                <span className="block sm:inline">{errorMessage}</span>
            </div>
        )}
        {renderTabContent()}
      </main>

      <footer className="bg-gray-900 text-center p-4 border-t border-gray-700">
        <p className="text-sm text-gray-500">
            VisuARM - Uma plataforma de aprendizado interativa. 
            <a href="https://github.com/tassyla/VisuARM" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 hover:text-blue-300 inline-flex items-center">
                <Github size={16} className="mr-1" /> Ver no GitHub
            </a>
        </p>
      </footer>
    </div>
  );
}

export default App;