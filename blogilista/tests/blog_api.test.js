// Testi importtaa tiedostoon app.js määritellyn Express-sovelluksen 
// ja käärii sen funktion supertest avulla ns. superagent-olioksi
// Tämä olio sijoitetaan muuttujaan api ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
  
// tyhjennetään blogilista aina aluksi
beforeEach(async () => {  
    await Blog.deleteMany({})  
    let blogObject = new Blog(helper.initialBlogs[0])  
    await blogObject.save()  
    blogObject = new Blog(helper.initialBlogs[1])  
    await blogObject.save()
})

// SuperTestin mekanismeja käyttävä testi
test('all blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

// testi blogin näyttämiselle
test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api    
        .get(`/api/blogs/${blogToView.id}`)    
        .expect(200)    
        .expect('Content-Type', /application\/json/)
    expect(resultBlog.body).toEqual(blogToView)
  })
  
  // testi blogin poistamiselle
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api    
        .delete(`/api/blogs/${blogToDelete.id}`)    
        .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(r => r.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })

// Jestin expect-kirjastoa käyttävä response.body:n oikeellisuutta tarkistava testi
test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog s title is within the returned titles', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Puutarhavuosi 2023')
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Katsaus päättyneeseen geokätköilyvuoteen 2023',   
        author: 'weellu',
        url: 'https://www.6123tampere.com/2024/01/01/katsaus-paattyneeseen-geokatkoilyvuoteen-2023/',
        likes: 3,  
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(n => n.title)

    expect(titles).toContain(
      'Katsaus päättyneeseen geokätköilyvuoteen 2023'
    )
})

// testaa, ettei ilman titlea voi tallentaa blogia
test('blog without title is not added', async () => {
    const newBlog = {
      likes: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

//Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat asynkronisia operaatioita
afterAll(async () => {
  await mongoose.connection.close() // katkaistaan vielä Mongoosen käyttämä tietokantayhteys
})
