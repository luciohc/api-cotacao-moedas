const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

// Conexão com PostgreSQL do Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



const app = express();
app.use(cors());
app.use(bodyParser.json());

// 👉 Cotação Dólar/Real usando Open Exchange Rates
app.get('/api/cotacoes/external/openex', async (req, res) => {
  try {
    const appId = 'bd736959f2914194917c4285e7558a4d';  // <-- Coloque sua API KEY aqui
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=BRL,EUR`);
    const rates = response.data.rates;
    
    const cotacoes = [
      { moeda: 'DÓLAR', valor: rates.BRL },
      { moeda: 'EURO', valor: rates.EUR }
    ];
    
    // Grava no banco cada uma
    for (const c of cotacoes) {
      await pool.query('INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2)', [c.moeda, c.valor]);
    }

    res.json({ message: 'Cotações salvas com sucesso!', cotacoes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 Cotação do Banco Central - Dólar e Euro
app.get('/api/cotacoes/external/bcb', async (req, res) => {
  try {
    const endpoints = [
      { moeda: 'DÓLAR', url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json' },
      { moeda: 'EURO', url: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.21619/dados/ultimos/1?formato=json' }
    ];

    const cotacoes = [];

    for (const endpoint of endpoints) {
      const response = await axios.get(endpoint.url);
      const valor = parseFloat(response.data[0].valor.replace(',', '.'));
      cotacoes.push({ moeda: endpoint.moeda, valor: valor });

      // Salvar no banco
      await pool.query('INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2)', [endpoint.moeda, valor]);
    }

    res.json({ message: 'Cotações do Banco Central salvas com sucesso!', cotacoes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para buscar cotação real do dólar (USD → BRL)
app.get('/api/cotacoes/external', async (req, res) => {
  try {
    const appId = 'bd736959f2914194917c4285e7558a4d'; // Substitua pela sua chave
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=BRL`);
    const valorDolarParaReal = response.data.rates.BRL;
    res.json({ moeda: 'DÓLAR', valor: valorDolarParaReal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 CREATE - Cadastrar nova cotação
app.post('/api/cotacoes', async (req, res) => {
  const { moeda, valor } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cotacoes (moeda, valor) VALUES ($1, $2) RETURNING *',
      [moeda, valor]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 READ - Listar todas as cotações
app.get('/api/cotacoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cotacoes ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 UPDATE - Atualizar uma cotação
app.put('/api/cotacoes/:id', async (req, res) => {
  const { id } = req.params;
  const { moeda, valor } = req.body;
  try {
    await pool.query(
      'UPDATE cotacoes SET moeda = $1, valor = $2 WHERE id = $3',
      [moeda, valor, id]
    );
    res.json({ message: 'Cotação atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 👉 DELETE - Excluir uma cotação
app.delete('/api/cotacoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cotacoes WHERE id = $1', [id]);
    res.json({ message: 'Cotação excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rodar servidor com porta dinâmica
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Backend rodando na porta ${PORT}`);
});


