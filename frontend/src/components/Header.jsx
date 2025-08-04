// components/Header.jsx
// Componente para o cabeçalho, incluindo o título e as abas de navegação.
// É um componente puro de UI, recebe o estado da aba ativa e a função para alterá-la.
import React from 'react';
import { Cpu, FileDown, MemoryStick, Code, Settings2 } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'code', label: 'Código', icon: Code },
    { id: 'assembly', label: 'Assembly & Otimização', icon: Settings2 },
    { id: 'memory', label: 'Execução & Memória', icon: MemoryStick },
    { id: 'files', label: 'Arquivos Gerados', icon: FileDown },
  ];

  const NavButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center px-3 py-2 text-sm md:px-4 md:py-2 md:text-base font-medium rounded-md transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Icon size={18} className="mr-2" />
        {label}
      </button>
    );
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Cpu size={32} className="text-blue-400" />
            <h1 className="text-xl md:text-2xl font-bold ml-3 tracking-wider">
              Visu<span className="text-blue-400">ARM</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map(item => <NavButton key={item.id} {...item} />)}
          </nav>
        </div>
         {/* Navegação para telas menores */}
        <div className="md:hidden flex items-center justify-center space-x-1 p-2 bg-gray-800 border-t border-gray-700">
             {navItems.map(item => <NavButton key={item.id} {...item} />)}
        </div>
      </div>
    </header>
  );
};

export default Header;
