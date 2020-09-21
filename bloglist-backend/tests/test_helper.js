const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
    {
      title: 'banana',
      author: '1234567891',
      url: 'www.test.com',
      likes: 5
    },
    {
        title: 'testing',
        author: 'tester',
        url: 'www.test.com',
        likes: 8
    },
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  const getOneUser = async (params) => {
    const user = await User.findOne(params || { username: 'root' })

    return user.toJSON()
}

  const getTokenFor = user => jwt.sign(user, process.env.SECRET)

  module.exports = {
      initialBlogs, blogsInDb, usersInDb, getTokenFor, getOneUser
  }