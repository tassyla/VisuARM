// components/MemoryTab.jsx
// Placeholder para a visualização da memória.
import React from 'react';

const MemoryTab = () => {
    const MemorySection = ({ name, color, description }) => (
        <div className={`bg-gray-800 p-4 rounded-lg border-l-4 ${color}`}>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-400 mt-2 text-sm">{description}</p>
            <div className="mt-4 bg-gray-700 h-8 rounded w-full">
                {/* Visualização gráfica viria aqui */}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">Visualização da Memória</h2>
            <p className="text-gray-400">
                Esta seção mostrará como o programa compilado é organizado na memória do processador ARM.
                A visualização será atualizada após a simulação da execução. (Funcionalidade futura)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemorySection name=".text" color="border-green-500" description="Armazena as instruções do programa (o código executável). Geralmente é somente leitura para evitar modificações acidentais." />
                <MemorySection name=".data" color="border-yellow-500" description="Contém as variáveis globais e estáticas que são inicializadas com um valor diferente de zero." />
                <MemorySection name=".bss" color="border-orange-500" description="Para variáveis globais e estáticas não inicializadas ou inicializadas com zero. O sistema operacional aloca e zera essa memória antes do programa iniciar." />
                <MemorySection name="Heap" color="border-purple-500" description="Área de memória para alocação dinâmica (ex: malloc). Cresce 'para cima', em direção a endereços de memória maiores." />
                <MemorySection name="Stack" color="border-red-500" description="Usada para variáveis locais, argumentos de função e endereços de retorno. Cresce 'para baixo', em direção a endereços de memória menores." />
            </div>
        </div>
    );
};

export default MemoryTab;
