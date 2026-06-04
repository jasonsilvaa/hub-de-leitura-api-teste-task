/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
               token = tkn
          })
     });

     // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando
     // Validar que filtros por categoria e autores funcionam corretamente
     it('GET - Deve listar livros com filtros e paginação', () => {
          cy.api({
               method: 'GET',
               url: 'books',
               headers: { 'Authorization': token },
               qs: {
                    page: 1,
                    limit: 5,
                    category: 'Ficção',
                    author: 'George Orwell'
               }
          }).should(response => {
               expect(response.status).to.equal(200)
               expect(response.body.books).to.be.an('array')
               expect(response.body.pagination).to.have.property('total')
               expect(response.body.pagination).to.have.property('currentPage')
               expect(response.body.pagination.limit).to.equal(5)
               expect(response.body.filters.category).to.equal('Ficção')
               expect(response.body.filters.author).to.equal('George Orwell')
               response.body.books.forEach(livro => {
                    expect(livro).to.have.property('id')
                    expect(livro).to.have.property('title')
                    expect(livro).to.have.property('author')
                    expect(livro.author).to.equal('George Orwell')
               })
          })
     });

     // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID
     // Verificar que todos os campos do livro são retornados corretamente
     it('GET - Deve obter detalhes de um livro específico', () => {
          cy.api({
               method: 'GET',
               url: 'books/4',
               headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200)
               expect(response.body.book).to.have.property('id', 4)
               expect(response.body.book).to.have.property('title')
               expect(response.body.book).to.have.property('author')
               expect(response.body.book).to.have.property('description')
               expect(response.body.book).to.have.property('category')
               expect(response.body.book).to.have.property('isbn')
               expect(response.body.book).to.have.property('editor')
               expect(response.body.book).to.have.property('language')
               expect(response.body.book).to.have.property('publication_year')
               expect(response.body.book).to.have.property('pages')
               expect(response.body.book).to.have.property('format')
               expect(response.body.book).to.have.property('total_copies')
               expect(response.body.book).to.have.property('available_copies')
               expect(response.body.availability).to.have.property('isAvailable')
               expect(response.body.statistics).to.have.property('total_reviews')
          })
     });

     // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo
     // Verificar que apenas admin pode adicionar novos livros (validação de permissão)
     it('POST - Deve cadastrar um novo livro com sucesso', () => {
          const titulo = `Livro Teste Cypress ${Date.now()}`
          const isbn = `978-test-${Date.now()}`
          cy.api({
               method: 'POST',
               url: 'books',
               headers: { 'Authorization': token },
               body: {
                    title: titulo,
                    author: 'Autor Teste',
                    description: 'Descrição do livro de teste',
                    category: 'Ficção',
                    isbn: isbn,
                    editor: 'Editora Teste',
                    language: 'Português',
                    publication_year: 2024,
                    pages: 200,
                    format: 'Físico',
                    total_copies: 3,
                    available_copies: 3,
                    cover_image: 'test.jpg'
               }
          }).should(response => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Livro criado com sucesso.')
               expect(response.body.book).to.have.property('id')
               expect(response.body.book.title).to.equal(titulo)
               expect(response.body.book.author).to.equal('Autor Teste')
               expect(response.body.book.isbn).to.equal(isbn)
          })
     });

     // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro
     // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
     it('POST -  Deve rejeitar livro com dados inválidos', () => {
          cy.api({
               method: 'POST',
               url: 'books',
               headers: { 'Authorization': token },
               body: {
                    author: 'Autor sem título'
               },
               failOnStatusCode: false
          }).should(response => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('"title" is required')
               expect(response.body.field).to.equal('title')
          })
     });

     // Objetivo: Validar que um livro pode ser atualizado com sucesso
     // Verificar que apenas admin pode atualizar livros (validação de permissão)
     it('PUT - Deve atualizar um livro previamente cadastrado', () => {
          const tituloOriginal = `Livro para Atualizar ${Date.now()}`
          const isbn = `978-put-${Date.now()}`
          cy.api({
               method: 'POST',
               url: 'books',
               headers: { 'Authorization': token },
               body: {
                    title: tituloOriginal,
                    author: 'Autor Original',
                    description: 'Descrição original',
                    category: 'Ficção',
                    isbn: isbn,
                    editor: 'Editora Teste',
                    language: 'Português',
                    publication_year: 2020,
                    pages: 150,
                    format: 'Físico',
                    total_copies: 2,
                    available_copies: 2,
                    cover_image: 'put-test.jpg'
               }
          }).then(response => {
               const bookId = response.body.book.id
               cy.api({
                    method: 'PUT',
                    url: `books/${bookId}`,
                    headers: { 'Authorization': token },
                    body: {
                         title: 'Livro Atualizado Cypress',
                         author: 'Autor Atualizado'
                    }
               }).should(putResponse => {
                    expect(putResponse.status).to.equal(200)
                    expect(putResponse.body.message).to.equal('Livro atualizado com sucesso.')
                    expect(putResponse.body.bookId).to.equal(bookId)
               })
          })
     });

     // Objetivo: Validar que um livro pode ser removido do catálogo
     // Verificar que apenas admin pode deletar livros (validação de permissão)
     it('DELETE - Deve deletar um livro previamente cadastrado', () => {
          const tituloDeletar = `Livro para Deletar ${Date.now()}`
          const isbn = `978-del-${Date.now()}`
          cy.api({
               method: 'POST',
               url: 'books',
               headers: { 'Authorization': token },
               body: {
                    title: tituloDeletar,
                    author: 'Autor Deletar',
                    description: 'Descrição para exclusão',
                    category: 'Ficção',
                    isbn: isbn,
                    editor: 'Editora Teste',
                    language: 'Português',
                    publication_year: 2021,
                    pages: 100,
                    format: 'Físico',
                    total_copies: 1,
                    available_copies: 1,
                    cover_image: 'del-test.jpg'
               }
          }).then(response => {
               const bookId = response.body.book.id
               cy.api({
                    method: 'DELETE',
                    url: `books/${bookId}`,
                    headers: { 'Authorization': token }
               }).should(deleteResponse => {
                    expect(deleteResponse.status).to.equal(200)
                    expect(deleteResponse.body.message).to.equal('Livro deletado com sucesso.')
                    expect(deleteResponse.body.deletedBook.id).to.equal(bookId)
                    expect(deleteResponse.body.deletedBook.title).to.equal(tituloDeletar)
               })
          })
     });
});
