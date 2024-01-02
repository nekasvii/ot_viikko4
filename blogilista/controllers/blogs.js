// Teht 4.15 blogilistan laajennus step3 OK
// lisätty blogimerkinnän yhteyteen tieto käyttäjästä

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)  
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// bogimerkinnän muokkaus
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, 
    { 
      new: true, 
      runValidators: true, 
      context: 'query' 
    })

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter