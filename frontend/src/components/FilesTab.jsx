// components/FilesTab.jsx
// Exibe os arquivos gerados pela compilação e permite o download.
import React from 'react';
import { BookCopy, FileDown } from 'lucide-react';

const FilesTab = ({ result }) => {
    // Usamos os arquivos da primeira otimização bem-sucedida como referência
    const firstSuccess = Object.values(result).find(r => !r.error && r.files.length > 0);
    const files = firstSuccess ? firstSuccess.files : [];

    const fileDescriptions = {
        '.elf': 'Executable and Linkable Format. O arquivo executável final, que contém o código, dados e metadados para o sistema operacional carregar o programa.',
        '.map': 'Arquivo de mapa. Descreve a alocação de memória do programa, mostrando onde cada função e variável foi colocada.',
        '.s': 'Arquivo Assembly. O código de montagem gerado pelo compilador a partir do código C.',
        '.o': 'Arquivo objeto. Código de máquina intermediário gerado a partir de um arquivo fonte antes da etapa de linkagem.',
    };
    
    // Função para o download
    const handleDownload = (fileName, content) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Necessário para FireFox
        element.click();
        document.body.removeChild(element);
    }

    if (!firstSuccess) {
        return (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
                <BookCopy size={48} className="mx-auto text-gray-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-400">Nenhum arquivo gerado</h2>
                <p className="text-gray-500 mt-2">Compile o código na primeira aba para ver os arquivos de saída aqui.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-400">Arquivos de Saída da Compilação</h2>
            {files.map(file => (
                <div key={file.name} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-200">{file.name}</h3>
                        <p className="text-sm text-gray-400">{fileDescriptions[file.extension] || 'Arquivo gerado pelo processo de compilação.'}</p>
                    </div>
                    <button 
                        onClick={() => handleDownload(file.name, file.content)}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <FileDown size={18} className="mr-2" />
                        Download
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FilesTab;
