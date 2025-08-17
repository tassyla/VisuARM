// frontend/src/components/MemoryTab.jsx
// Visualização interativa da memória baseada nos dados do arquivo .map
import React, { useState } from 'react';
import { BookCopy, Search, ArrowRight } from 'lucide-react';

// Este componente agora espera receber os dados do mapa de memória
const MemoryTab = ({ result }) => {
    // Extrai os dados do mapa de memória do primeiro resultado de compilação bem-sucedido
    const memoryData = Object.values(result).find(r => r && r.memoryMap)?.memoryMap;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);

    if (!memoryData) {
        return (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
                <BookCopy size={48} className="mx-auto text-gray-500" />
                <h2 className="mt-4 text-xl font-semibold text-gray-400">Mapa de Memória Indisponível</h2>
                <p className="text-gray-500 mt-2">Compile o código para gerar e visualizar o mapa de memória.</p>
            </div>
        );
    }
    
    // Separa as seções por tipo de memória (Flash vs RAM)
    const flashSections = memoryData.filter(s => parseInt(s.startAddr, 16) < 0x20000000);
    const ramSections = memoryData.filter(s => parseInt(s.startAddr, 16) >= 0x20000000);

    const MemoryBar = ({ title, sections, totalSize, usedSize }) => (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-blue-400">{title}</h3>
                <span className="text-sm text-gray-400">
                    {usedSize.toLocaleString()} / {totalSize.toLocaleString()} bytes usados ({((usedSize / totalSize) * 100).toFixed(2)}%)
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-8 flex overflow-hidden">
                {sections.map((section, index) => {
                    const width = (section.size / totalSize) * 100;
                    return (
                        <div
                            key={index}
                            className="h-full group relative flex items-center justify-center text-xs text-white"
                            style={{ 
                                width: `${width}%`, 
                                backgroundColor: section.color || '#60a5fa', // Cor padrão
                                minWidth: '2px' // Garante que seções muito pequenas ainda sejam visíveis
                            }}
                            onClick={() => setSelectedSection(section.name)}
                        >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity z-10">{section.name}</span>
                            <div className="absolute bottom-full mb-2 w-max p-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <strong>{section.name}</strong><br />
                                Endereço: {section.startAddr}<br />
                                Tamanho: {section.size.toLocaleString()} bytes
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const sectionColors = {
        '.text': '#22c55e', // green-500
        '.data': '#f59e0b', // amber-500
        '.bss': '#f97316', // orange-500
    };

    flashSections.forEach(s => s.color = sectionColors[s.name] || '#3b82f6');
    ramSections.forEach(s => s.color = sectionColors[s.name] || '#8b5cf6');

    const allSymbols = memoryData.flatMap(section => 
        (section.symbols || []).map(symbol => ({ ...symbol, sectionName: section.name }))
    );

    const filteredSymbols = allSymbols.filter(symbol => 
        (!selectedSection || symbol.sectionName === selectedSection) &&
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-blue-400">Tabela de Símbolos</h3>
                    {selectedSection && (
                        <button onClick={() => setSelectedSection(null)} className="text-sm text-blue-400 hover:underline">
                            Limpar filtro: {selectedSection}
                        </button>
                    )}
                </div>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Pesquisar símbolo..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-4 py-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-gray-800">
                            <tr>
                                <th className="p-2">Símbolo</th>
                                <th className="p-2">Endereço</th>
                                <th className="p-2">Tamanho (bytes)</th>
                                <th className="p-2">Seção</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSymbols.map((symbol, index) => (
                                <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-2 font-mono">{symbol.name}</td>
                                    <td className="p-2 font-mono">{symbol.addr}</td>
                                    <td className="p-2 font-mono">{symbol.size}</td>
                                    <td className="p-2">
                                        <span className="px-2 py-1 rounded-full text-xs" style={{backgroundColor: sectionColors[symbol.sectionName] + '40', color: sectionColors[symbol.sectionName]}}>
                                            {symbol.sectionName}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredSymbols.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum símbolo encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemoryTab;
