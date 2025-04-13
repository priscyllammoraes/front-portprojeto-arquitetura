// ==================== VARIÁVEIS GLOBAIS ====================
const API_URL = "http://127.0.0.1:5000";

// Este arquivo scripts.js contém apenas as funções necessárias para inicializar a aplicação e gerenciador de SPA

// ==================== SPA ====================
function loadPage(page) {
  const container = document.getElementById("conteudo");
  if (!container) return;

  if (page === 'home') {
    container.innerHTML = '<p>Bem-vinda ao sistema de gestão de projetos!</p>';
  } else {
    fetch(`paginas/${page}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then(html => {
        container.innerHTML = html;
        if (page === 'projetos.html') carregarProjetos();
        if (page === 'cadastro-projeto.html') inicializarFormularioProjeto();
        if (page === 'cadastro-recurso.html') inicializarFormularioRecurso();
        if (page === 'recursos.html') carregarRecursos();
        if (page === 'gerenciar-equipe.html') inicializarEquipeTela();
      })
      .catch(() => {
        container.innerHTML = '<p>Erro ao carregar página.</p>';
      });
  }
}

function fecharSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
}

// ==================== EVENTO INICIAL ====================
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("mouseenter", () => sidebar.classList.add("open"));
    sidebar.addEventListener("mouseleave", () => sidebar.classList.remove("open"));
  }

  document.querySelectorAll(".submenu").forEach(item => {
    item.addEventListener("mouseenter", () => item.classList.add("open"));
    item.addEventListener("mouseleave", () => item.classList.remove("open"));
  });

  loadPage("projetos.html");
});
