
# 📈 API Cotação de Moedas 💱

Projeto de uma API CRUD para gerenciamento de cotações de moedas (ex: Dólar, Euro), com integração a fontes externas (Banco Central do Brasil e Open Exchange Rates), utilizando:

- Node.js + Express + PostgreSQL (Backend)
- React + JQuery + Ajax + Bootstrap (Frontend)

---

## ✅ Funcionalidades

### 📌 CRUD Manual de Cotações
- Criar, listar, editar e excluir cotações manualmente.

### 📌 Integração com APIs externas
- Buscar cotações reais do **Banco Central do Brasil (BCB)**
- Buscar cotações reais do **Open Exchange Rates**
- Armazenar automaticamente os resultados no PostgreSQL

---

## ✅ Tecnologias utilizadas

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, JQuery, Ajax, Bootstrap
- **APIs externas:** Banco Central (API SGS), Open Exchange Rates
- **Banco de Dados:** PostgreSQL

---

## ✅ Estrutura de Pastas

```
api-cotacao-moedas/
├── backend/
│   └── app.js (e outros arquivos de backend)
├── frontend/
│   └── src/
│       └── App.js, index.js, etc.
└── README.md
```

---

## ✅ Como rodar o projeto

### 📌 Configuração do PostgreSQL

1. Criar o banco de dados:

```sql
CREATE DATABASE cotacao_db;
```

2. Conectar ao banco:

```sql
\c cotacao_db
```

3. Criar a tabela:

```sql
CREATE TABLE cotacoes (
  id SERIAL PRIMARY KEY,
  moeda VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_cotacao DATE DEFAULT CURRENT_DATE
);
```

---

### 📌 Rodando o Backend

```bash
cd backend
npm install
node app.js
```

Ou com nodemon:

```bash
nodemon app.js
```

---

### 📌 Rodando o Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## ✅ Endpoints disponíveis

### 👉 CRUD de Cotações (manuais)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/cotacoes` | Lista todas as cotações |
| POST | `/api/cotacoes` | Cadastra nova cotação |
| PUT | `/api/cotacoes/:id` | Atualiza uma cotação |
| DELETE | `/api/cotacoes/:id` | Exclui uma cotação |

---

### 👉 Integração Externa (Banco Central + Open Exchange Rates)

| Método | Rota | Fonte | Descrição |
|---|---|---|---|
| GET | `/api/cotacoes/external/bcb` | Banco Central | Busca cotações oficiais (Dólar, Euro) |
| GET | `/api/cotacoes/external/openex` | Open Exchange Rates | Busca cotações do OpenEx (Dólar, Euro) |

---

## ✅ Observações importantes:

- Para o **Open Exchange Rates**, é necessário criar uma conta gratuita e obter um **App ID**:  
👉 https://openexchangerates.org/signup/free

- Coloque sua chave no `app.js`:

```javascript
const appId = 'SUA_API_KEY_AQUI';
```

- Garanta que o PostgreSQL esteja rodando durante os testes.



