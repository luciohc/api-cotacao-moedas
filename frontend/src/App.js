import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cotacoes, setCotacoes] = useState([]);
  const [moeda, setMoeda] = useState('');
  const [valor, setValor] = useState('');
  const [editId, setEditId] = useState(null);

  // Função para carregar todas as cotações
  const carregarCotacoes = () => {
    $.get('http://localhost:5000/api/cotacoes', (data) => {
      setCotacoes(data);
    });
  };

  // Carregar as cotações assim que o app iniciar
  useEffect(() => {
    carregarCotacoes();
  }, []);

  // Função para salvar ou atualizar uma cotação
  const salvarCotacao = () => {
    const url = editId
      ? `http://localhost:5000/api/cotacoes/${editId}`
      : 'http://localhost:5000/api/cotacoes';
    const method = editId ? 'PUT' : 'POST';

    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      data: JSON.stringify({ moeda, valor }),
      success: () => {
        setMoeda('');
        setValor('');
        setEditId(null);
        carregarCotacoes();
      },
      error: (xhr) => {
        alert('Erro ao salvar cotação: ' + xhr.responseText);
      },
    });
  };

  // Função para deletar uma cotação
  const deletarCotacao = (id) => {
    $.ajax({
      url: `http://localhost:5000/api/cotacoes/${id}`,
      method: 'DELETE',
      success: carregarCotacoes,
      error: (xhr) => {
        alert('Erro ao excluir cotação: ' + xhr.responseText);
      },
    });
  };

  // Função para preencher o formulário ao clicar em Editar
  const editarCotacao = (cotacao) => {
    setMoeda(cotacao.moeda);
    setValor(cotacao.valor);
    setEditId(cotacao.id);
  };

  return (
  <div className="container mt-4">
    <h2 className="text-primary mb-4">Cadastro de Cotações de Moedas</h2>

    {/* Formulário de cadastro */}
    <div className="mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Moeda (ex: Dólar, Euro)"
        value={moeda}
        onChange={(e) => setMoeda(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button className="btn btn-success" onClick={salvarCotacao}>
        {editId ? 'Atualizar Cotação' : 'Salvar Cotação'}
      </button>
    </div>

    {/* ✅ Aqui entram os botões novos */}
    <div className="mb-3">
      <button
        className="btn btn-primary me-2"
        onClick={() => {
          $.get('http://localhost:5000/api/cotacoes/external/bcb', () => {
            alert('Cotações do Banco Central salvas!');
            carregarCotacoes();
          }).fail(() => alert('Erro ao buscar cotação do BCB'));
        }}
      >
        Buscar cotações do Banco Central (BCB)
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => {
          $.get('http://localhost:5000/api/cotacoes/external/openex', () => {
            alert('Cotações do Open Exchange Rates salvas!');
            carregarCotacoes();
          }).fail(() => alert('Erro ao buscar cotação do OpenEx'));
        }}
      >
        Buscar cotações do Open Exchange Rates
      </button>
    </div>

    {/* Tabela de cotações */}
    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Moeda</th>
          <th>Valor</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {cotacoes.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.moeda}</td>
            <td>{c.valor}</td>
            <td>{c.data_cotacao}</td>
            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editarCotacao(c)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deletarCotacao(c.id)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}

export default App;
