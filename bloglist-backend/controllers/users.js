const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  //Check if the username or password hasn't been set
  if (!(body.username) || !(body.password)) {
    return response.status(400).json({ error: 'Username or password can\'t be empty' })
  }
  //Check if the username and password is less than 3 characters long
  else if ((body.username.length < 3) || (body.password.length < 3)) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long' })
  }
  else {

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
}
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
  })

module.exports = usersRouter