// Teht 4.15 blogilistan laajennus step3
// HTTP POST ‑pyyntö osoitteeseen api/users
// Käyttäjillä on käyttäjätunnus, salasana ja nimi
// salasanat bcrypt-kirjaston avulla laskettuna hash'inä

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