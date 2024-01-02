// Teht 4.15 blogilistan laajennus step3
// HTTP POST ‑pyyntö osoitteeseen api/users
// Käyttäjillä on käyttäjätunnus, salasana ja nimi
// salasanat bcrypt-kirjaston avulla 

const config = require('./utils/config')
const express = require('express') // npm install express
require('express-async-errors') // npm install express-async-errors
const cors = require('cors') // npm install cors
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose') // npm install mongoose@7.6.5

const app = express()
module.exports = app

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app