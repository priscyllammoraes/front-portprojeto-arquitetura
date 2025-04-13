# Portfólio de Projetos - Interface Web

Este projeto foi desenvolvido como parte do MVP da disciplina **Arquitetura de Software** da Pós-Graduação.

A aplicação é uma **interface web SPA (Single Page Application)** criada com **HTML, CSS e JavaScript puro**, e se comunica com uma API Flask para o gerenciamento de um portfólio de projetos de TI.

---

## Funcionalidades

1. **Gerenciamento de Projetos**
   - Listagem, criação, edição e exclusão de projetos.
   - Visualização e adição de histórico por projeto.
   - Conversão automática de custo BRL → USD.

2. **Gerenciamento de Recursos**
   - Cadastro, edição e exclusão de recursos humanos vinculáveis a projetos.

3. **Gerenciar Equipe de Projeto**
   - Visualizar equipe vinculada a cada projeto.
   - Vincular e desvincular recursos dinamicamente com base em disponibilidade.

4. **Interface SPA Modular**
   - Navegação dinâmica via JavaScript sem recarregar páginas.
   - Menu lateral com comportamento responsivo e intuitivo.
   - Layout customizado e responsivo.

---

## Tecnologias Utilizadas

- HTML5 (semântico)
- CSS3
- JavaScript
- Docker + Nginx

---

## Estrutura do Projeto

```bash
app-front/
├── index.html
├── styles.css
├── imagens/
│   └── logo.png
├── icones/
│   ├── editar.png
│   ├── deletar.png
│   └── ...
├── js/
│   ├── main.js              # Inicialização e navegação SPA
│   ├── projeto.js           # Lógica CRUD de projetos
│   ├── recurso.js           # Lógica CRUD de recursos
│   └── equipe.js            # Gerenciamento da equipe de projetos
├── paginas/
│   ├── projetos.html
│   ├── cadastro-projeto.html
│   ├── recursos.html
│   ├── cadastro-recurso.html
│   └── gerenciar-equipe.html
├── Dockerfile
└── README.md
```

---

## Executando Localmente

### 1. Clonar o Repositório

```bash
git clone https://github.com/priscyllammoraes/frontend-portfolio-projeto
cd frontend-portfolio-projeto
```

### 2. Executar Servidor Local

Você pode usar o Python para servir o projeto localmente:

```bash
python -m http.server 8000
```

Acesse via navegador: [http://localhost:8080](http://localhost:8080)

---

## Executando com Docker (Nginx)

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal e seus arquivos de aplicação e
Execute **como administrador** os seguintes comandos para construir a imagem Docker e executar o container:

### Build da imagem

```bash
docker build -t app-front .
```

### Executar o container

```bash
docker run -p 8080:80 app-front
```

Acesse em: [http://localhost:8080](http://localhost:8080)

> Certifique-se de que a API Flask (`app-api`) está rodando em `http://localhost:5000`

---

## Integração com API

Este frontend consome os seguintes endpoints da API Flask:

### Projetos
- `GET /projetos`
- `GET /projeto?id=1`
- `POST /projeto`
- `PUT /projeto`
- `DELETE /projeto?id=1`

### Recursos
- `GET /recursos`
- `GET /recurso?id=1`
- `POST /recurso`
- `PUT /recurso`
- `DELETE /recurso?id=1`

### Histórico
- `GET /historico?id=1`
- `POST /historico?id=1`

### Equipe (Relacionamento)
- `GET /projeto/recursos?id=1`
- `GET /recursos-disponiveis?id=1`
- `POST /projeto/recurso?id_projeto=1&id_recurso=2`
- `DELETE /projeto/recurso?id_projeto=1&id_recurso=2`

---

## Autor

- Priscylla Moraes  
  GitHub: [@priscyllammoraes](https://github.com/priscyllammoraes)
