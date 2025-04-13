// ==================== PROJETOS ====================

function inicializarFormularioProjeto() {
  const form = document.getElementById("formProjeto");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = form.dataset.id || null;
    const nome = document.getElementById("nome").value;
    const sigla = document.getElementById("sigla").value;
    const descricao = document.getElementById("descricao").value;
    const tipo = document.getElementById("tipo").value;
    const custoInput = document.getElementById("custo").value;
    const custo = parseFloat(custoInput.replace(/[^\d,]/g, '').replace(',', '.'));
    const status = document.getElementById("status").value;

    const novoProjeto = { nome, sigla, descricao, tipo, custo, status };

    try {
      let response;
      if (id) {
        novoProjeto.id = parseInt(id, 10);
        response = await fetch(`${API_URL}/projeto`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoProjeto),
        });
      } else {
        response = await fetch(`${API_URL}/projeto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoProjeto),
        });
      }

      if (response.ok) {
        alert(id ? 'Projeto atualizado com sucesso!' : 'Projeto adicionado com sucesso!');
        loadPage("projetos.html");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.mensagem}`);
      }
    } catch (error) {
      alert("Erro ao enviar projeto");
      console.error(error);
    }
  });
}


async function carregarProjetos() {
    try {
      const response = await fetch(`${API_URL}/projetos`);
      const projects = await response.json();
      const tabela = document.getElementById('projetosTabelaBody');
      if (!tabela) return;
      tabela.innerHTML = '';

      projects.forEach(async project => {
        const row = document.createElement('tr');
        const custoFormatado = formatCurrency(project.custo);
        const celulaCustoUSD = document.createElement('td');
        celulaCustoUSD.textContent = "Carregando...";

        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nome}</td>
          <td>${project.sigla}</td>
          <td>${project.tipo}</td>
          <td>${custoFormatado}</td>        
          <td>${project.descricao}</td>
          <td class="status">${project.status}</td>
          <td>
            <div class="button-container">
              <button class="icon-button" onclick="editarProjeto(${project.id})">
                <img src="icones/editar.png" alt="Editar" class="icon"><span class="tooltip">Editar</span>
              </button>
              <button class="icon-button" onclick="listarRecursosProjeto(${project.id})">
                <img src="icones/equipe.png" alt="Recursos" class="icon"><span class="tooltip">Recursos</span>
              </button>
              <button class="icon-button" onclick="adicionarHistorico(${project.id})">
                <img src="icones/adicionar.png" alt="Histórico" class="icon"><span class="tooltip">Adicionar Histórico</span>
              </button>
              <button class="icon-button" onclick="listarHistorico(${project.id})">
                <img src="icones/historico.png" alt="Histórico" class="icon"><span class="tooltip">Ver Histórico</span>
              </button>
              <button class="icon-button" onclick="deletarProjeto(${project.id})">
                <img src="icones/deletar.png" alt="Deletar" class="icon"><span class="tooltip">Deletar</span>
              </button>
            </div>
          </td>
        `;

        row.insertBefore(celulaCustoUSD, row.children[4].nextSibling);
        tabela.appendChild(row);

        try {
          const resposta = await fetch(`${API_URL}/conversao?valor=${project.custo}&de=BRL&para=USD`);
          const dados = await resposta.json();
          celulaCustoUSD.textContent = dados?.valor_convertido ? `$ ${dados.valor_convertido.toFixed(2)}` : "Erro na conversão";
        } catch {
          celulaCustoUSD.textContent = "Erro na conversão";
        }

        estiloTabelaStatus();
      });
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }
  
  function formatCurrency(value) {
    const numberValue = parseFloat(value).toFixed(2);
    return isNaN(numberValue) ? "R$ 0,00" : "R$ " + numberValue.replace(".", ",");
  }
  
  function formatarMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 2) valor = valor.replace(/(\d)(\d{2})$/, '$1,$2');
    if (valor.length > 6) valor = valor.replace(/(\d)(\d{3})(\d{1,2}$)/, '$1.$2,$3');
    if (valor.length > 9) valor = valor.replace(/(\d)(\d{3})(\d{3})(\d{1,2}$)/, '$1.$2.$3,$4');
    input.value = 'R$ ' + valor;
  }

  function estiloTabelaStatus() {
    document.querySelectorAll('.status').forEach(cell => {
      const status = cell.textContent.trim();
      if (status === "A iniciar") cell.classList.add("status-a-iniciar");
      if (status === "Em andamento") cell.classList.add("status-em-andamento");
      if (status === "Suspenso") cell.classList.add("status-suspenso");
      if (status === "Cancelado") cell.classList.add("status-cancelado");
      if (status === "Concluído") cell.classList.add("status-concluido");
    });
  }

  async function editarProjeto(id) {
    if (!document.getElementById('formProjeto')) await loadPage('cadastro-projeto.html');
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
      const response = await fetch(`${API_URL}/projeto?id=${id}`);
      if (!response.ok) throw new Error("Projeto não encontrado");
      const data = await response.json();
      document.getElementById('nome').value = data.nome;
      document.getElementById('sigla').value = data.sigla;
      document.getElementById('descricao').value = data.descricao;
      document.getElementById('tipo').value = data.tipo;
      document.getElementById('custo').value = data.custo.toFixed(2).replace('.', ',');
      document.getElementById('status').value = data.status;
      document.getElementById('formProjeto').dataset.id = id;
    } catch (error) {
      alert("Erro ao buscar projeto");
      console.error(error);
    }
  }

  function deletarProjeto(id) {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    fetch(`${API_URL}/projeto?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        alert(`Projeto ${data.mensagem}`);
        carregarProjetos();
      })
      .catch(error => {
        console.error('Erro ao excluir projeto:', error);
        alert('Erro ao excluir projeto.');
      });
  }

  async function adicionarHistorico(id) {
    const descricao = prompt("Digite a descrição do histórico:");
    if (!descricao) return;
    const historico = { descricao };
  
    try {
      const response = await fetch(`${API_URL}/historico?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historico)
      });
  
      if (response.ok) {
        alert("Histórico adicionado com sucesso");
      } else {
        const erro = await response.json();
        alert("Erro: " + erro.mensagem);
      }
    } catch (error) {
      alert("Erro ao adicionar histórico");
      console.error(error);
    }
  }

  async function listarHistorico(id) {
    try {
      const response = await fetch(`${API_URL}/historico?id=${id}`);
      const data = await response.json();
  
      const container = document.getElementById("historico-container");
      container.innerHTML = data.historico.length === 0 ? "<p>Sem histórico.</p>" : "";
  
      data.historico.forEach(item => {
        const div = document.createElement("div");
        div.innerHTML = `<p><strong>${item.data_insercao}</strong> - ${item.descricao}</p>`;
        container.appendChild(div);
      });
  
      abrirModal();
    } catch (error) {
      alert("Erro ao carregar histórico");
      console.error(error);
    }
  }

  function abrirModal() {
    document.getElementById("historicoModal").style.display = "block";
  }
  
  function fecharModal() {
    document.getElementById("historicoModal").style.display = "none";
  }