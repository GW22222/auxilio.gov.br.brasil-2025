from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime, timedelta
import random
import string
import time

app = Flask(__name__, static_folder='', static_url_path='')

# Configuração avançada de CORS
CORS(app, resources={
    r"/gerar-pix": {"origins": "*"},
    r"/verificar-pagamento/*": {"origins": "*"},
    r"/webhook-mercadopago": {"origins": "*"},
    r"/pagamento-pix.html": {"origins": "*"}
})

# Simulação de banco de dados em memória
payments_db = {}
qr_codes_db = {}

# Gerador de IDs de pagamento
def generate_payment_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))

# Simulação de API do Mercado Pago
def mercado_pago_simulator(amount, email, name, cpf):
    # Simula um atraso na API
    time.sleep(1)
    
    payment_id = generate_payment_id()
    expiration = datetime.now() + timedelta(minutes=15)
    
    # Simula a geração de um QR Code (em produção, seria gerado pelo Mercado Pago)
    qr_code_data = f"00020126580014BR.GOV.BCB.PIX0136{payment_id}5204000053039865404{amount:.2f}5802BR5925GOVBR PAGAMENTOS6007BRASIL62260522{payment_id}6304"
    
    return {
        "success": True,
        "qr_code": qr_code_data,
        "qr_base64": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAABl5f1ZAAAAA1BMVEX///+nxBvIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAFUlEQVRoge3BAQ0AAADCoPdPbQ43oAAAAAAuNhB5AAE0eBBxAAAAAElFTkSuQmCC",  # QR code dummy
        "pix_code": qr_code_data,
        "payment_id": payment_id,
        "expiration": expiration.isoformat(),
        "status": "pending"
    }

@app.route('/gerar-pix', methods=['POST'])
def gerar_pix():
    try:
        data = request.get_json()
        
        # Validação dos dados
        if not data or 'email' not in data or 'valor' not in data:
            return jsonify({
                "success": False,
                "error": "Email e valor são obrigatórios"
            }), 400
        
        try:
            valor = float(data['valor'])
            if valor <= 0:
                return jsonify({
                    "success": False,
                    "error": "Valor deve ser positivo"
                }), 400
        except ValueError:
            return jsonify({
                "success": False,
                "error": "Valor deve ser um número válido"
            }), 400
        
        # Simular chamada ao Mercado Pago
        response = mercado_pago_simulator(
            amount=valor,
            email=data['email'],
            name=data.get('nome', 'Cliente GovBR'),
            cpf=data.get('cpf', '')
        )
        
        # Armazenar no "banco de dados"
        payments_db[response['payment_id']] = {
            "status": "pending",
            "amount": valor,
            "email": data['email'],
            "created_at": datetime.now().isoformat(),
            "expiration": response['expiration']
        }
        
        qr_codes_db[response['payment_id']] = response['qr_code']
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Erro interno no servidor",
            "details": str(e)
        }), 500

@app.route('/verificar-pagamento/<payment_id>', methods=['GET'])
def verificar_pagamento(payment_id):
    try:
        # Simulação: 20% de chance de aprovação após 5 segundos
        if payment_id in payments_db:
            payment = payments_db[payment_id]
            
            # Simular aprovação aleatória após tempo mínimo
            if (datetime.now() - datetime.fromisoformat(payment['created_at'])).seconds > 5:
                if random.random() < 0.2:  # 20% de chance de aprovação
                    payment['status'] = 'approved'
                    payment['approved_at'] = datetime.now().isoformat()
            
            return jsonify({
                "status": payment['status'],
                "payment_details": {
                    "id": payment_id,
                    "amount": payment['amount'],
                    "status": payment['status'],
                    "created_at": payment['created_at'],
                    "expiration": payment['expiration']
                }
            })
        else:
            return jsonify({
                "error": "Pagamento não encontrado"
            }), 404
            
    except Exception as e:
        return jsonify({
            "error": "Erro ao verificar pagamento",
            "details": str(e)
        }), 500

@app.route('/webhook-mercadopago', methods=['POST'])
def webhook():
    try:
        data = request.get_json()
        print("🔔 Webhook recebido:", data)
        
        # Simular processamento do webhook
        if data and 'payment_id' in data:
            payment_id = data['payment_id']
            if payment_id in payments_db:
                payments_db[payment_id]['status'] = data.get('status', 'pending')
                
        return jsonify({"received": True}), 200
    
    except Exception as e:
        print("Erro no webhook:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/pagamento-pix.html', methods=['GET'])
def pagina_pagamento():
    try:
        # Verifica se o arquivo existe
        if not os.path.exists('pagamento-pix.html'):
            return "Arquivo pagamento-pix.html não encontrado", 404
            
        with open('pagamento-pix.html', 'r', encoding='utf-8') as file:
            content = file.read()
            return content, 200, {'Content-Type': 'text/html'}
    
    except Exception as e:
        return f"Erro ao carregar a página: {str(e)}", 500

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/health-check', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "database": "ok" if payments_db else "empty",
            "environment": os.getenv('FLASK_ENV', 'development')
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)