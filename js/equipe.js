// ==================== EQUIPE ====================

function inicializarEquipeTela() {
    carregarProjetosParaEquipe();
    const selectProjeto = document.getElementById("selectProjeto");
    if (selectProjeto) {
      selectProjeto.addEventListener("change", () => {
        const idProjeto = selectProjeto.value;
        carregarEquipeProjeto(idProjeto);
        //carregarRecursosDisponiveis(idProjeto);
      });
    }
}

async function carregarProjetosParaSelecao() {
  try {
    const response = await fetch(`${API_URL}/projetos`);
    const projetos = await response.json();
    const select = document.getElementById("projetoSelect");
    select.innerHTML = '<option value="">Selecione um projeto...</option>';

    projetos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.id} - ${p.nome} (${p.sigla})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
  }
}

async function carregarEquipeProjeto(idProjeto) {
  try {
    const response = await fetch(`${API_URL}/projeto/recursos?id=${idProjeto}`);
    const data = await response.json();
    const tabela = document.getElementById("recursosTabelaBodyEquipe");
    tabela.innerHTML = "";

    if (data.recursos.length === 0) {
      tabela.innerHTML = '<tr><td colspan="5">Nenhum recurso vinculado.</td></tr>';
      return;
    }

    data.recursos.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.id}</td>
        <td>${r.nome}</td>
        <td>${r.papel}</td>
        <td>${r.alocacao}</td>
        <td>
          <button class="icon-button" onclick="removerRecursoProjeto(${idProjeto}, ${r.id})">
            <img src="icones/deletar.png" alt="Remover" class="icon">
            <span class="tooltip">Remover</span>
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar equipe do projeto:", error);
  }
}

async function adicionarRecursoProjeto() {
  const idProjeto = document.getElementById("projetoSelect").value;
  const idRecurso = document.getElementById("recursoSelect").value;
  if (!idProjeto || !idRecurso) {
    alert("Selecione o projeto e o recurso.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/projeto/recurso?id_projeto=${idProjeto}&id_recurso=${idRecurso}`, {
      method: "POST"
    });

    if (response.ok) {
      alert("Recurso adicionado com sucesso!");
      carregarEquipeProjeto(idProjeto);
      carregarRecursosDisponiveis(idProjeto);
    } else {
      const erro = await response.json();
      alert("Erro: " + erro.mensagem);
    }
  } catch (error) {
    console.error("Erro ao adicionar recurso ao projeto:", error);
  }
}

async function removerRecursoProjeto(idProjeto, idRecurso) {
  if (!confirm("Deseja realmente remover este recurso do projeto?")) return;

  try {
    const response = await fetch(`${API_URL}/projeto/recurso?id_projeto=${idProjeto}&id_recurso=${idRecurso}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Recurso removido com sucesso!");
      carregarEquipeProjeto(idProjeto);
      carregarRecursosDisponiveis(idProjeto);
    } else {
      const erro = await response.json();
      alert("Erro: " + erro.mensagem);
    }
  } catch (error) {
    console.error("Erro ao remover recurso:", error);
  }
}


async function carregarProjetosParaEquipe() {
  const selectProjeto = document.getElementById("selectProjeto");
  if (!selectProjeto) return;
  selectProjeto.innerHTML = '<option value="">Selecione um projeto...</option>';

  try {
    const response = await fetch(`${API_URL}/projetos`);
    const projetos = await response.json();

    projetos.forEach(projeto => {
      const option = document.createElement("option");
      option.value = projeto.id;
      option.textContent = `${projeto.id} - ${projeto.nome} (${projeto.sigla})`;
      selectProjeto.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar projetos na combo de equipe:", error);
  }
}

async function carregarEquipeProjeto(idProjeto) {
  const tabela = document.getElementById("tabelaEquipeBody");
  if (!tabela || !idProjeto) return;
  tabela.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/projeto/recursos?id=${idProjeto}`);
    const data = await response.json();
    const recursos = data.recursos || [];

    recursos.forEach(recurso => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${recurso.id}</td>
        <td>${recurso.nome}</td>
        <td>${recurso.papel}</td>
        <td>${recurso.alocacao}</td>
        <td>
          <button class="icon-button" onclick="desvincularRecurso(${idProjeto}, ${recurso.id})">
            <img src="icones/deletar.png" alt="Desvincular" class="icon">
            <span class="tooltip">Desvincular</span>
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });

    carregarRecursosDisponiveis(idProjeto);

  } catch (error) {
    console.error("Erro ao carregar equipe do projeto:", error);
  }
}

async function desvincularRecurso(idProjeto, idRecurso) {
  if (!idProjeto || !idRecurso) return;

  try {
    const response = await fetch(`${API_URL}/projeto/recurso?id_projeto=${idProjeto}&id_recurso=${idRecurso}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.mensagem || "Recurso desvinculado com sucesso!");
      carregarEquipeProjeto(idProjeto);  // Recarrega a equipe do projeto
      carregarRecursosDisponiveis(idProjeto); // Recarrega a lista de recursos disponíveis
    } else {
      alert(data.mensagem || "Erro ao desvincular recurso.");
    }
  } catch (error) {
    console.error("Erro ao desvincular recurso:", error);
    alert("Erro ao realizar operação.");
  }
}