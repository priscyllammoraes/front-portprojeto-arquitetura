// ==================== RECURSOS ====================

function inicializarFormularioRecurso() {
  const form = document.getElementById("formRecurso");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = form.dataset.id || null;
    const nome = document.getElementById("nome").value;
    const papel = document.getElementById("papel").value;
    const alocacao = document.getElementById("alocacao").value;
    const projetoId = document.getElementById("projeto_id")?.value || null;

    const recurso = { nome, papel, alocacao };

    try {
      let response;

      if (id) {
        recurso.id = parseInt(id, 10);
        response = await fetch(`${API_URL}/recurso`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recurso),
        });
      } else {
        response = await fetch(`${API_URL}/recurso`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recurso),
        });
      }

      if (!response.ok) {
        const erro = await response.json();
        alert("Erro ao salvar recurso: " + erro.mensagem);
        return;
      }

      const data = await response.json();
      const idRecursoCriado = data.id || data.recurso_id || recurso.id;

      // Se fornecido um projeto_id, faz a vinculação
      if (projetoId) {
        const vincular = await fetch(`${API_URL}/projeto/recurso?id_projeto=${projetoId}&id_recurso=${idRecursoCriado}`, {
          method: "POST"
        });

        if (!vincular.ok) {
          const erroVinculo = await vincular.json();
          alert("Erro ao vincular recurso: " + erroVinculo.mensagem);
        }
      }

      alert(id ? "Recurso atualizado com sucesso!" : "Recurso cadastrado com sucesso!");
      form.reset();
      delete form.dataset.id;
      loadPage("recursos.html");
    } catch (error) {
      console.error("Erro ao salvar recurso:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
}

  async function carregarRecursos() {
    try {
      const response = await fetch(`${API_URL}/recursos`);
      const recursos = await response.json();
      const tabela = document.getElementById("recursosTabelaBody");
      if (!tabela) return;
      tabela.innerHTML = "";

      recursos.forEach(recurso => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${recurso.id}</td>
          <td>${recurso.nome}</td>
          <td>${recurso.papel}</td>
          <td>${recurso.alocacao}</td>
          <td>
            <div class="button-container">
              <button class="icon-button" onclick="editarRecurso(${recurso.id})">
                <img src="icones/editar.png" alt="Editar" class="icon"><span class="tooltip">Editar</span>
              </button>
              <button class="icon-button" onclick="deletarRecurso(${recurso.id})">
                <img src="icones/deletar.png" alt="Deletar" class="icon"><span class="tooltip">Deletar</span>
              </button>
            </div>
          </td>
        `;
        tabela.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
      alert("Erro ao carregar a lista de recursos.");
    }
  }
  
  async function editarRecurso(id) {
    try {
      const response = await fetch(`${API_URL}/recurso?id=${id}`);
      if (!response.ok) throw new Error("Recurso não encontrado");
      const data = await response.json();
      await loadPage('cadastro-recurso.html');
      await new Promise(resolve => setTimeout(resolve, 50));
      document.getElementById("nome").value = data.nome;
      document.getElementById("papel").value = data.papel;
      document.getElementById("alocacao").value = data.alocacao;
      document.getElementById("formRecurso").dataset.id = data.id;
    } catch (error) {
      alert("Erro ao buscar recurso.");
      console.error(error);
    }
  }
  
  
  function deletarRecurso(id) {
    if (!confirm("Tem certeza que deseja excluir este recurso?")) return;
    fetch(`${API_URL}/recurso?id=${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem || "Recurso excluído com sucesso!");
        carregarRecursos();
      })
      .catch(error => {
        console.error("Erro ao excluir recurso:", error);
        alert("Erro ao excluir recurso.");
      });
  }

  async function carregarRecursosDisponiveis(idProjeto) {
    const selectRecurso = document.getElementById("selectRecurso");  
  
    if (!selectRecurso || !idProjeto) return;
  
    selectRecurso.innerHTML = '<option value="">Selecione um recurso...</option>'; 
  
    try {
      const response = await fetch(`${API_URL}/recursos-disponiveis?id=${idProjeto}`);
      const data = await response.json();
      const recursos = data.recursos || [];

      const recursosAdicionados = new Set();
  
      recursos.forEach(recurso => {
        const option = document.createElement("option");
        option.value = recurso.id;
        option.textContent = `${recurso.id} - ${recurso.nome} (${recurso.papel}, ${recurso.alocacao})`;
        selectRecurso.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar recursos disponíveis:", error);
    }
  }

  async function vincularRecursoProjeto() {
    const projetoId = document.getElementById("selectProjeto").value;
    const recursoId = document.getElementById("selectRecurso").value;
  
    if (!projetoId || !recursoId) {
      alert("Selecione um projeto e um recurso.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/projeto/recurso?id_projeto=${projetoId}&id_recurso=${recursoId}`, {
        method: "POST"
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.mensagem || "Recurso vinculado com sucesso.");
        carregarEquipeProjeto(projetoId);
      } else {
        alert(data.mensagem || "Erro ao vincular recurso.");
      }
  
    } catch (error) {
      console.error("Erro ao vincular recurso:", error);
      alert("Erro de conexão ao tentar vincular o recurso.");
    }
  }

  async function listarRecursosProjeto(id) {
    try {
      const response = await fetch(`${API_URL}/projeto/recursos?id=${id}`);
      const data = await response.json();
      const container = document.getElementById("recursos-container");
      container.innerHTML = "";
  
      if (data.recursos.length === 0) {
        container.innerHTML = "<p>Sem recursos vinculados.</p>";
      } else {
        data.recursos.forEach(r => {
          const div = document.createElement("div");
          div.innerHTML = `<p><strong>${r.nome}</strong> - ${r.papel} (${r.alocacao})</p>`;
          container.appendChild(div);
        });
      }
      abrirModalRecursos();
    } catch (error) {
      alert("Erro ao carregar recursos");
      console.error(error);
    }
  }
  
  function abrirModalRecursos() {
    document.getElementById("recursosModal").style.display = "block";
  }
  
  function fecharModalRecursos() {
    document.getElementById("recursosModal").style.display = "none";
  }