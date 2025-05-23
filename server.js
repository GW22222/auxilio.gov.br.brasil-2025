const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Carrega variáveis de ambiente (se quiser usar .env localmente)
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use variável de ambiente para token (mais seguro)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-2877707535605999-051421-8678b94fd090cec6e74b864717c134bc-514128435'
});

const payment = new Payment(client);

// Cache simples de PIX para evitar duplicação
const pixCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

app.post('/gerar-pix', async (req, res) => {
  const { email, valor, nome, cpf } = req.body;

  if (!email || !valor) {
    return res.status(400).json({ success: false, error: 'Email e valor são obrigatórios' });
  }

  const cacheKey = `${email}-${valor}`;
  if (pixCache.has(cacheKey)) {
    const cached = pixCache.get(cacheKey);
    if ((Date.now() - cached.timestamp) < CACHE_TTL) {
      return res.json(cached.data);
    }
    pixCache.delete(cacheKey);
  }

  try {
    const response = await payment.create({
      body: {
        transaction_amount: parseFloat(valor),
        payment_method_id: 'pix',
        payer: {
          email,
          first_name: nome?.split(' ')[0] || 'Cliente',
          last_name: nome?.split(' ').slice(1).join(' ') || '',
          identification: {
            type: 'CPF',
            number: cpf || '00000000000'
          }
        },
        description: 'Liberação de Benefício',
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    });

    const pixInfo = response.point_of_interaction.transaction_data;
    const result = {
      success: true,
      qr_code: pixInfo.qr_code,
      qr_base64: pixInfo.qr_code_base64,
      pix_code: pixInfo.br_code,
      payment_id: response.id
    };

    pixCache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    res.status(500).json({ success: false, error: 'Erro ao gerar PIX', detalhes: error.message });
  }
});

// 🚨 Use a porta dinâmica fornecida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

