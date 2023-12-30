// teht 4.1 blogilista step1 OK
// sovellusrunko valmiina 
// toimiva npm-projekti OK
// konffataan nodemonille toimivaksi OK
// tietokanta MongoDB Atlasissa OK
// testataan VS code REST clientilla blogien lisäys ja blogien näyttö OK

import dotenv from 'dotenv'; // npm install dotenv
dotenv.config();

import express from 'express' // npm install express
import cors from 'cors' // npm install cors
import mongoose from 'mongoose' // npm install mongoose@7.6.5

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

// MongoDB Atlaksen käyttö ympäristömuuttujan avulla
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:3003/api/bloglist'
console.log('connecting to', mongoUrl)

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
.then(result => {    
    console.log('connected to MongoDB')  
})  
.catch((error) => {    
    console.log('error connecting to MongoDB:', error.message)  
})

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})