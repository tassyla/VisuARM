
import subprocess
import os
import uuid

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

    # Comando GCC simplificado para ARM bare metal
    gcc_cmd = [
        'arm-none-eabi-gcc',
        c_path,
        '-o', elf_path,
        '-nostdlib',
        '-nostartfiles',
        '-mcpu=cortex-m3',
        '-mthumb',
        '-Wl,-Ttext=0x00000000',
        opt_level,
        '-Wl,-Map=' + map_path,
        '-e', '_start'
    ]

    try:
        result = subprocess.run(gcc_cmd, check=True, capture_output=True, text=True)
        
        # Gera o assembly
        objdump_result = subprocess.run(
            ['arm-none-eabi-objdump', '-d', elf_path], 
            check=True, capture_output=True, text=True
        )
        
        with open(s_path, 'w') as f:
            f.write(objdump_result.stdout)
            
        # Lê arquivos gerados
        files = []
        for ext in ['.c', '.elf', '.s', '.map']:
            file_path = base + ext
            if os.path.exists(file_path):
                if ext == '.elf':
                    # Arquivo binário - não tenta ler o conteúdo
                    files.append({
                        'name': os.path.basename(file_path),
                        'content': '[Binary ELF file - cannot display as text]',
                        'extension': ext
                    })
                else:
                    # Arquivos texto
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            files.append({
                                'name': os.path.basename(file_path),
                                'content': f.read(),
                                'extension': ext
                            })
                    except UnicodeDecodeError:
                        files.append({
                            'name': os.path.basename(file_path),
                            'content': '[Binary file - cannot display as text]',
                            'extension': ext
                        })
        
        return { 
            'status': 'success', 
            'assembly': objdump_result.stdout, 
            'uid': uid,
            'files': files
        }
    except subprocess.CalledProcessError as e:
        error_msg = f"Compilation failed: {e}"
        if e.stderr:
            error_msg += f"\nStderr: {e.stderr}"
        if e.stdout:
            error_msg += f"\nStdout: {e.stdout}"
        return { 'status': 'error', 'error': error_msg }
    except FileNotFoundError:
        return { 
            'status': 'error', 
            'error': 'arm-none-eabi-gcc not found. Please install ARM GCC toolchain.' 
        }