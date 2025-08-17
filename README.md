# VisuARM 🚀
Uma plataforma web didática para compilar, analisar e visualizar a execução de código C em processadores ARM.

## 📖 Introdução
VisuARM é uma ferramenta educacional interativa, desenvolvida como uma Single-Page Application (SPA), projetada para auxiliar estudantes de arquitetura de computadores a entenderem o ciclo de vida de um programa, desde o código-fonte em C até sua execução em um ambiente bare-metal.

A plataforma permite escrever código C, compilá-lo para Assembly ARM, comparar visualmente o impacto de diferentes níveis de otimização e analisar como o programa é organizado na memória através do mapa de símbolos.

## ✨ Funcionalidades Principais
📝 Editor de Código Moderno: Escreva código C em um ambiente familiar com o Monaco Editor (o motor do VS Code).

⚙️ Compilação para ARM: Compile seu código C para Assembly ARM (Cortex-M3) usando a toolchain GCC.

📊 Comparação de Otimizações: Visualize lado a lado o código Assembly gerado com diferentes flags de otimização (-O0, -O1, -O2, -O3) e entenda o impacto de cada uma.

🗺️ Análise de Memória: Explore o mapa de memória e a tabela de símbolos gerados pelo linker para entender como as seções (.text, .data, .bss) são alocadas.

📂 Artefatos de Compilação: Acesse e baixe os arquivos gerados pelo processo de compilação, como .elf, .s e .map, para análise em outras ferramentas.

## 🛠️ Tecnologias Utilizadas
Frontend:

* React 19 com Vite
* Monaco Editor
* Tailwind CSS
* Lucide React (Ícones)
* react-diff-view (Visualizador de diferenças)

Backend:

* Python 3
* Flask & Flask-CORS
* pyelftools (Análise de arquivos ELF)

Toolchain:

* ARM GCC (arm-none-eabi-gcc)

## 🚀 Guia de Instalação e Execução
Siga os passos abaixo para executar o projeto em seu ambiente local.

1. Pré-requisitos
Certifique-se de que você tem as seguintes ferramentas instaladas:

* Git
* Python (3.8+)
* Node.js (18+) e npm
* ARM GCC Toolchain (arm-none-eabi-gcc)
* Linux (Ubuntu/Debian): sudo apt install gcc-arm-none-eabi

2. Clonar o Repositório

* git clone [https://github.com/tassyla/VisuARM.git](https://github.com/tassyla/VisuARM.git)
```
cd VisuARM
```

3. Configurar o Backend (Servidor)

Abra um primeiro terminal na raiz do projeto.

* Navegue até a pasta do backend
```
cd backend
```

* Crie e ative um ambiente virtual

```
python3 -m venv venv
source venv/bin/activate
```

* Instale as dependências
```
pip install Flask Flask-CORS pyelftools
```

* Inicie o servidor
```
python3 app.py
```

O backend estará rodando em http://localhost:5000.

4. Configurar o Frontend (Cliente)

Abra um segundo terminal na raiz do projeto.

* Navegue até a pasta do frontend
```
cd frontend
```

* Instale as dependências
```
npm install
```

* Inicie o servidor de desenvolvimento
```
npm run dev
```

O frontend estará acessível em http://localhost:5173.

5. Acessando a Aplicação

Abra seu navegador e acesse http://localhost:5173. A aplicação VisuARM estará pronta para uso!
