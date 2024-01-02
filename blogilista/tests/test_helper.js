// apu tiedosto testikomponenteille
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [  
    {    
      title: 'Puutarhavuosi 2023',   
      author: 'Satu',
      url: 'https://satupuutarhassa.blogspot.com/2024/01/puutarhavuosi-2023.html',
      likes: 2,  
    },  
    {    
      title: 'John Grisham: Lain molemmin puolin ',   
      author: 'Anneli Airola',
      url: 'http://kirjojenkuisketta.blogspot.com/2024/01/john-grisham-lain-molemmin-puolin.html',
      likes: 1,  
    },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, 
  nonExistingId, 
  blogsInDb,
  usersInDb
}