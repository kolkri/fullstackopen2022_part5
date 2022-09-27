describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Linda Liukas',
      username: 'liulin',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function() {
    cy.contains('Log in to application')
  })
  it('login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })
  it('user can login with correct info', function () {
    cy.contains('login').click()
    cy.get('#username').type('liulin')
    cy.get('#password').type('password')
    cy.get('#login-button').click()

    cy.contains('Linda Liukas logged in')
  })
  it('login fails with wrong password', function () {
    cy.contains('login').click()
    cy.get('#username').type('liulin')
    cy.get('#password').type('pasword')
    cy.get('#login-button').click()

    cy.get('.error').contains('invalid username or password')
    cy.get('html').should('not.contain', 'Linda Liukas logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'liulin', password: 'password' })
      cy.createBlog({ title: 'first blog', author:'first author', url:'google.com', likes: 3 })
    })

    it('a blog can be created', function () {
      cy.contains('first blog')
    })
    it('A blog can be liked', function() {
      cy.get('#view').click()
      cy.get('#like').click()
      cy.contains('likes: 4')
    })
    it('A blog can be removed', function() {
      cy.get('#view').click()
      cy.get('#remove').click()
      cy.contains('blog first blog removed')
    })
    it('blogs are sorted by likes', function() {
      cy.createBlog({ title: 'second blog', author:'second author', url:'google.com', likes: 5 })
      cy.createBlog({ title: 'third blog', author:'third author', url:'google.com', likes:4 })
      cy.get('.blog').eq(0).should('contain', 'second blog')
      cy.get('.blog').eq(1).should('contain', 'third blog')
      cy.get('.blog').eq(2).should('contain', 'first blog')
    })
  })
})

