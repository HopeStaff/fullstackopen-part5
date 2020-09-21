describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
      const user = {
        name: 'Just a test',
        username: 'User X',
        password: 'Password X'
      }
      cy.request('POST', 'http://localhost:3001/api/users/', user)
      cy.visit('http://localhost:3000')
    })
  
    it('Login form is shown', function() {

      cy.contains('Log in to application')
    })

    describe('Login',function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
          name: 'Just a test',
          username: 'User X',
          password: 'Password X'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
      })

      it('succeeds with correct credentials', function() {
      cy.get('#username')
      .type('User X')
      cy.get('#password')
      .type('Password X')
      cy.get('#login-btn')
      .click()
      //log out
      cy.get('#logout-btn')
      .click()
      })
  
      it('fails with wrong credentials', function() {
        cy.get('#username')
        .type('User X')
        cy.get('#password')
        .type('Password Y')
        cy.get('#login-btn')
        .click()

        cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      // log in user here
     cy.request('POST', 'http://localhost:3001/api/login', {
      username: 'User X', password: 'Password X'
    }).then(response => {
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
    })

    it('A blog can be created', function() {
      cy.get('#create-new-btn')
      .click()
      cy.get('#title').type('A blog created by cypress')
      cy.get('#author').type('The author of cypress')
      cy.get('#url').type('The URL of cypress')
      cy.get('#create-btn').click()
      cy.contains('A blog created by cypress The author of cypress')
    })

    it('A user can like a blog', function() {
        cy.createBlog({
          title: 'Just a test',
          author: 'User X',
          url: 'www.test.com',
          likes: 0
        })
      cy.get('.view-btn')
      .click()
      cy.get('#like-btn')
      .click()
      cy.contains('Likes: 1')
    })

    it('A user can delete a blog', function() {
      cy.createBlog({
        title: 'Just a test',
        author: 'User X',
        url: 'www.test.com',
        likes: 0
      })
    cy.get('.view-btn').eq(0)
    .click()
    cy.get('#remove-btn')
    .click()

    let blogs = {}

    cy.request('GET', 'http://localhost:3001/api/blogs')
    .then((response) => {
      blogs = response.body

      if (blogs.length < 1) {
        return true
      }
      else {
        return false
      }
    }).should('equal', true)
  })

    it('Blogs are ordered correctly', function() {
      cy.createBlog({
        title: 'Just a test',
        author: 'User X',
        url: 'www.test.com',
        likes: 5
      })

      cy.createBlog({
        title: 'Another test',
        author: 'User Y',
        url: 'www.yyy.com',
        likes: 5
      })

      cy.createBlog({
        title: 'Test',
        author: 'User Z',
        url: 'www.zzz.com',
        likes: 7
      })
      
      let blogs = {}
      let inOrder
      
      cy.request('GET', 'http://localhost:3001/api/blogs')
      .then((response) => {
        blogs = response.body

        inOrder = inCorrectOrder(blogs)

        if (inOrder) {
          return true
        }
        else {
          return false
        }
      }).should('equal', true)
    })
  })

  function inCorrectOrder(arrayToCheck) {
    let inOrder = true

    arrayToCheck.map((curBlog, i) => {
      if (i !== 0) {
        if (curBlog.likes < arrayToCheck[i-1].likes) {
          inOrder = false
        }
      }
    })

    return inOrder
  }

})