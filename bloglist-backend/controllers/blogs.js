const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//View the blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  })

//Post a blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const token = request.token

    //Verify if token is true, else set to null
    const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null

    //Get the user (if decodedToken isn't null)
    const user = !decodedToken ? null : await User.findById(decodedToken.id)
    
    //Check if a user was found
    if (!request.token || !decodedToken.id || !user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    

    //If the title and url are missing
    if (!(body.title) && !(body.url)) {
        response.status(400).end()
    } else {
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
      })
  
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    }
  })

  //Delete a blog
  blogsRouter.delete('/:id', async (request, response) => {
    const body = request.body
    const token = request.token

    //Verify if token is true, else set to null
    const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null

    //Get the user (if decodedToken isn't null)
    const user = !decodedToken ? null : await User.findById(decodedToken.id)
    
    //Check if a user was found
    if (!request.token || !decodedToken.id || !user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    

    const blog = await Blog.findById(request.params.id)

        //Check if a blog was found
        if (blog === null) {
          return response.status(404).end()
        }

    if (blog.user.toString() === user.id.toString()) {

        await Blog.findByIdAndRemove(request.params.id)
        await User.findOneAndUpdate(
            { _id: user.id }, 
            { $pull: { blogs: request.params.id } }).exec()

        //Send back 204 (No Content)
        response.status(204).end()
    } else {
        response.status(401).json({ error: 'You are not the owner of this blog' })
    }
  })

   //Update a blog
   blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    
    /* Required adjustments for part 5 of the course.
    const token = request.token

   
    //Verify if token is true, else set to null
    const decodedToken = token ? jwt.verify(token, process.env.SECRET) : null

    //Get the user (if decodedToken isn't null)
    const user = !decodedToken ? null : await User.findById(decodedToken.id)
    
    //Check if a user was found
    if (!request.token || !decodedToken.id || !user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    */
    

    const blog = await Blog.findById(request.params.id)

        //Check if a blog was found
        if (blog === null) {
          return response.status(404).end()
        }

    // Required adjustments for part 5 of the course.
    //if (blog.user.toString() === user.id.toString()) {

    //console.log('the blog is ', blog)

      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.json(updatedBlog)
    /* Required adjustments for part 5 of the course.
    } else {
        response.status(401).json({ error: 'You are not the owner of this blog' })
    }
    */
  })

  /** 
  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  })
  */


module.exports = blogsRouter