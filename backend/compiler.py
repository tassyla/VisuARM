

# backend/compiler.py
import subprocess
import os
import uuid
from memory_parser import parse_map_file 

def compile_c_code(code, opt_level):
    uid = uuid.uuid4().hex[:8]
    base = f'backend/static/outputs/{uid}'
    c_path = base + '.c'
    elf_path = base + '.elf'
    s_path = base + '.s'
    map_path = base + '.map'

    # Adiciona um startup code básico para ARM bare metal
    startup_code = """
// Startup code for ARM bare metal
void _start(void) {
    // Call main function
    int result = main();
    // Infinite loop to prevent processor from continuing
    while(1) {
        // Do nothing
    }
}

// User code:
"""
    full_code = startup_code + code

    with open(c_path, 'w') as f:
        f.write(full_code)

    gcc_cmd = [
        'arm-none-eabi-gcc', c_path, '-o', elf_path,
        '-nostdlib', '-nostartfiles', '-mcpu=cortex-m3', '-mthumb',
        '-Wl,-Ttext=0x00000000', opt_level, '-Wl,-Map=' + map_path, '-e', '_start'
    ]

    try:
        subprocess.run(gcc_cmd, check=True, capture_output=True, text=True)
        
        objdump_result = subprocess.run(
            ['arm-none-eabi-objdump', '-d', elf_path],
            check=True, capture_output=True, text=True
        )
        
        with open(s_path, 'w') as f:
            f.write(objdump_result.stdout)
            
        # --- LÓGICA DO PARSER INTEGRADA ---
        map_data = {}
        try:
            with open(map_path, 'r', encoding='utf-8') as f:
                map_content = f.read()
            map_data = parse_map_file(map_content) # <-- 2. CHAMA O PARSER
        except Exception as e:
            print(f"Erro ao processar o arquivo .map: {e}")
            # Continua mesmo se o parser falhar, mas o mapa de memória estará vazio

        files = []
        for ext in ['.c', '.elf', '.s', '.map']:
            file_path = base + ext
            if os.path.exists(file_path):
                content = '[Binary file - cannot display as text]'
                if ext != '.elf':
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                    except Exception:
                        pass
                files.append({
                    'name': os.path.basename(file_path),
                    'content': content,
                    'extension': ext
                })
        
        # --- 3. ADICIONA OS DADOS DO MAPA AO RESULTADO FINAL ---
        final_result = {
            'status': 'success',
            'assembly': objdump_result.stdout,
            'uid': uid,
            'files': files
        }
        final_result.update(map_data)
        
        return final_result

    except subprocess.CalledProcessError as e:
        error_msg = f"Compilation failed: {e.stderr or e.stdout or e}"
        return {'status': 'error', 'error': error_msg}
    except FileNotFoundError:
        return {
            'status': 'error',
            'error': 'arm-none-eabi-gcc not found. Please install ARM GCC toolchain.'
        }


