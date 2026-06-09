# 📚 Hub de Leitura - API Teste Task

Projeto de testes automatizados com Cypress para a API do **Catálogo de Livros** do Hub de Leitura. Exercício prático de automação de testes de API REST (EBAC).

**Repositório:** [github.com/jasonsilvaa/hub-de-leitura-api-teste-task](https://github.com/jasonsilvaa/hub-de-leitura-api-teste-task)

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Git
- **Servidor Hub de Leitura** rodando em `http://localhost:3000` (API em `/api/`)

## 🚀 Como baixar o projeto

```bash
git clone https://github.com/jasonsilvaa/hub-de-leitura-api-teste-task.git
cd hub-de-leitura-api-teste-task
```

> O projeto original do exercício está em [EBAC-QE/hub-de-leitura-api-teste-task](https://github.com/EBAC-QE/hub-de-leitura-api-teste-task).

## 📦 Instalação

```bash
npm install
```

Isso instala o Cypress, o plugin `cypress-plugin-api` e as demais dependências do `package.json`.

## ⚙️ Servidor da API

Antes de executar os testes, suba o servidor **Hub de Leitura** localmente. A `baseUrl` do Cypress está configurada em:

`http://localhost:3000/api/`

Verifique se a API está no ar:

```bash
curl http://localhost:3000/api/health
```

## 🏗️ Estrutura do projeto

```
.
├── cypress/
│   ├── e2e/
│   │   ├── exercicio.cy.js      # Testes do Catálogo de Livros (implementados)
│   │   └── usuarios.cy.js       # Exemplo de testes de usuários
│   ├── fixtures/
│   │   └── example.json
│   └── support/
│       ├── commands.js          # cy.geraToken(), cy.cadastrarUsuario(), cy.cadastrarLivro()
│       └── e2e.js
├── cypress.config.js
├── package.json
└── readme.md
```

## 📝 Como executar os testes

### Todos os testes (headless)

```bash
npm test
```

### Interface interativa do Cypress

```bash
npx cypress open
```

### Apenas o exercício do catálogo de livros

```bash
npx cypress run --spec "cypress/e2e/exercicio.cy.js"
```

## ✅ Cenários automatizados

Os 6 cenários em [cypress/e2e/exercicio.cy.js](cypress/e2e/exercicio.cy.js) estão implementados:

| # | Cenário | Método | Validações principais |
|---|---------|--------|------------------------|
| 1 | Listar livros com filtros e paginação | `GET /books` | Status 200, `books`, `pagination`, filtros por `category` e `author` |
| 2 | Obter detalhes de um livro | `GET /books/4` | Status 200, campos do `book`, `availability` e `statistics` |
| 3 | Cadastrar novo livro | `POST /books` | Status 201, mensagem de sucesso, `id` e dados do livro |
| 4 | Rejeitar dados inválidos | `POST /books` | Status 400, mensagem e campo de erro (`title`) |
| 5 | Atualizar livro cadastrado | `PUT /books/{id}` | Cria livro → atualiza → status 200 e mensagem de sucesso |
| 6 | Deletar livro cadastrado | `DELETE /books/{id}` | Cria livro → remove → status 200 e `deletedBook` |

**Detalhes da implementação:**

- Autenticação com `cy.geraToken('admin@biblioteca.com', 'admin123')` no `beforeEach`
- Requisições via `cy.api()` (plugin `cypress-plugin-api`)
- Comando customizado `cy.cadastrarLivro(token, dados)` para cadastro reutilizável nos cenários de PUT e DELETE
- Dados dinâmicos com `Date.now()` em título/ISBN para evitar conflito em reexecuções

## 🔑 Autenticação

```javascript
let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    })
});
```

Use o token no header `Authorization` nas requisições que exigem perfil admin (POST, PUT, DELETE).

## 📚 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/books` | Listar livros com filtros e paginação |
| GET | `/api/books/{id}` | Obter detalhes de um livro |
| POST | `/api/books` | Criar novo livro (Admin) |
| PUT | `/api/books/{id}` | Atualizar livro (Admin) |
| DELETE | `/api/books/{id}` | Deletar livro (Admin) |
| GET | `/api/books/categories` | Listar categorias |
| GET | `/api/books/authors` | Listar autores |

## 💡 Boas práticas utilizadas

1. **`cy.api()`** para requisições HTTP com relatório visual no Cypress
2. **`.should()`** com callbacks para asserções no body da resposta
3. **`failOnStatusCode: false`** em cenários de erro esperado (400)
4. **`beforeEach()`** para setup comum (token)
5. **Dados únicos por execução** em cadastros para testes estáveis e repetíveis

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Falha de autenticação | Confirme `cy.geraToken()` e credenciais do admin |
| Erro de conexão / ECONNREFUSED | Suba o Hub de Leitura em `localhost:3000` |
| POST falha na 2ª execução | Título/ISBN devem ser únicos (já tratado com `Date.now()`) |
| Módulos não encontrados | Execute `npm install` novamente |

## 📖 Documentação útil

- [Cypress Docs](https://docs.cypress.io/)
- [cypress-plugin-api](https://github.com/filiphric/cypress-plugin-api)
- [Cypress cy.request()](https://docs.cypress.io/api/commands/request)

## 👨‍💻 Autor

**Jason Silva** — Exercício EBAC · Automação de testes de API com Cypress.

---

Projeto base: [EBAC-QE/hub-de-leitura-api-teste-task](https://github.com/EBAC-QE/hub-de-leitura-api-teste-task)
