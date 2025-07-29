
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

    with open(c_path, 'w') as f:
        f.write(code)

    gcc_cmd = [
        'arm-none-eabi-gcc',
        c_path,
        '-o', elf_path,
        '-nostdlib', '-Ttext=0x00000000',
        opt_level,
        '-Wl,-Map=' + map_path
    ]

    try:
        subprocess.run(gcc_cmd, check=True)
        subprocess.run(['arm-none-eabi-objdump', '-d', elf_path], check=True, stdout=open(s_path, 'w'))
        with open(s_path) as f:
            asm = f.read()
        return { 'status': 'success', 'assembly': asm, 'uid': uid }
    except subprocess.CalledProcessError as e:
        return { 'status': 'error', 'error': str(e) }
    