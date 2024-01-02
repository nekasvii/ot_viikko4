// Teht 4.18 blogilistan laajennus step6 OK
// Token-perustainen kirjautuminen 
// Teht 4.19 blogilistan laajennus step7 OK 
// blogien lisäys vain kirjautuneille

const bcrypt = require('bcrypt') // npm install bcrypt
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'username and password must be minimum 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter