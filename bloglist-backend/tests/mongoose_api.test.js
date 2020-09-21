const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const User = require('../models/user')


describe('Basic blog tests', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
      }
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is defined', async () => {
    const response = await api.get('/api/blogs')

    
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
  })

  test('a new blog post are cerated successfully', async () => {
    const user = await helper.getOneUser()
    const token = helper.getTokenFor(user)

    const newBlog = {
        title: 'Test post',
        author: 'Just a tester',
        url: 'www.fromtesting.com',
        likes: 10
      }

      await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${token}` })
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'Test post'
  )
  })

  test('a new blog post fails with 401 Unauthorized if a token is not provided', async () => {
    const user = await helper.getOneUser()
    const token = helper.getTokenFor(user)

    const newBlog = {
        title: 'Test post',
        author: 'Just a tester',
        url: 'www.fromtesting.com',
        likes: 10
      }

      await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  //Checks that the lenght remains the same (no blog was added)
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })

  test('If a new blog is created with the likes property missing, it will default to 0', async () => {
    const user = await helper.getOneUser()
    const token = helper.getTokenFor(user)
    
      const newBlog = {
          title: 'Test post with no likes',
          author: 'Just a tester',
          url: 'www.fromtesting.com'
      }

      await api
      .post('/api/blogs')
      .set({ Authorization: `bearer ${token}` })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const insertedBlog = blogsAtEnd.find(blog => blog.title.valueOf() === 'Test post with no likes')
      expect(insertedBlog.likes).toBe(0)
  })

  test('If a new blog is created with the title and url properties missing, the backend responds with 400 Bad Request', async () => {
    const user = await helper.getOneUser()
    const token = helper.getTokenFor(user)

    const newBlog = {
        //title: 'Test post with no likes',
        author: 'Just a tester',
        //url: 'www.fromtesting.com',
        likes: 10
    }

    await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${token}` })
    .send(newBlog)
    .expect(400)

    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})
})


// *********************************
// users_api.test.js
// *********************************

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'MadMax',
        name: 'Mad Max',
        password: 'madpassword',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails if the user is already created', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Mad Max',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if the username is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'ro',
        name: 'Mad Max',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
        expect(result.body.error).toContain('Username and password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if the password is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'Matti',
        name: 'Mad Max',
        password: 'sa',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
        expect(result.body.error).toContain('Username and password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('creation fails if the username AND password is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'ro',
        name: 'Mad Max',
        password: 'sa',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
        expect(result.body.error).toContain('Username and password must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })

  

afterAll(() => {
  mongoose.connection.close()
})