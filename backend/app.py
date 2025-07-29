from flask import Flask, request, jsonify
from flask_cors import CORS
from compiler import compile_c_code
import os

app = Flask(__name__)
CORS(app)

@app.route('/compile', methods=['POST'])
def compile_code():
    code = request.json.get('code')
    opt = request.json.get('opt_level', '-O0')
    result = compile_c_code(code, opt)
    return jsonify(result)

if __name__ == '__main__':
    os.makedirs('backend/static/outputs', exist_ok=True)
    app.run(debug=True)
