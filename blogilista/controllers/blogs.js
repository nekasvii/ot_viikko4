// Teht 4.21 blogilistan laajennus step9 OK
// blogin poisto onnistuu vain merkinnän luoneen käyttäjän toimesta 
// ja kirjautuneena (token sama)
// testattu VS REST Clientillä toimivaksi

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {  
  const authorization = request.get('authorization')  
  if (authorization && authorization.startsWith('Bearer ')) {    
    return authorization.replace('Bearer ', '')  
  }  
  return null
}

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

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
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

// blogimerkinnän poisto
blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (error) {
    return next(error);
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  if (blog.user.toString() !== decodedToken.id) {
    return response.status(401).json({ error: 'no rights to delete this blog' });
  }

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