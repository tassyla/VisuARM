# backend/memory_parser.py
import re

def parse_map_file(map_content):
    """
    Analisa o conteúdo de um arquivo .map do ARM GCC para extrair seções de memória e símbolos.
    """
    memory_map = []
    
    # Regex para encontrar as seções principais no mapa de memória (ex: .text, .data)
    # Padrão: .section_name  start_address  size
    section_regex = re.compile(r'^\s*(\.\w+)\s+(0x[0-9a-fA-F]+)\s+(0x[0-9a-fA-F]+)')
    
    # Regex para encontrar símbolos (funções e variáveis) dentro de uma seção
    # Padrão: start_address symbol_name
    symbol_regex = re.compile(r'^\s*(0x[0-9a-fA-F]+)\s+([\w\.]+)')

    current_section = None
    lines = map_content.splitlines()

    for i, line in enumerate(lines):
        section_match = section_regex.match(line)
        
        # Se encontramos uma nova seção (ex: .text)
        if section_match:
            name = section_match.group(1)
            start_addr = section_match.group(2)
            size = int(section_match.group(3), 16)
            
            # Ignoramos seções de tamanho zero
            if size == 0:
                continue

            current_section = {
                "name": name,
                "startAddr": start_addr,
                "size": size,
                "symbols": []
            }
            memory_map.append(current_section)
            
            # Agora, olhamos as linhas seguintes para encontrar os símbolos desta seção
            j = i + 1
            while j < len(lines) and not lines[j].strip().startswith('.'):
                symbol_match = symbol_regex.match(lines[j])
                if symbol_match and current_section:
                    symbol_addr = symbol_match.group(1)
                    symbol_name = symbol_match.group(2)
                    
                    # Adicionamos o símbolo à seção atual
                    current_section["symbols"].append({
                        "name": symbol_name,
                        "addr": symbol_addr,
                        "size": 0 # O .map não informa o tamanho de cada símbolo diretamente
                    })
                j += 1

    # Heurística para calcular o tamanho dos símbolos (tamanho = endereço do próximo - endereço do atual)
    for section in memory_map:
        symbols = sorted(section['symbols'], key=lambda x: int(x['addr'], 16))
        for i, symbol in enumerate(symbols):
            if i + 1 < len(symbols):
                next_addr = int(symbols[i+1]['addr'], 16)
                current_addr = int(symbol['addr'], 16)
                symbol['size'] = next_addr - current_addr
            else:
                # Para o último símbolo, o tamanho é o fim da seção menos o início do símbolo
                section_end_addr = int(section['startAddr'], 16) + section['size']
                symbol_addr = int(symbol['addr'], 16)
                symbol['size'] = section_end_addr - symbol_addr
        section['symbols'] = symbols

    return {
        "memoryMap": memory_map
    }
