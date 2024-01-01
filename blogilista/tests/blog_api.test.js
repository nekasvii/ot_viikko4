// Testi importtaa tiedostoon app.js määritellyn Express-sovelluksen 
// ja käärii sen funktion supertest avulla ns. superagent-olioksi
// Tämä olio sijoitetaan muuttujaan api ja sen kautta testit voivat tehdä HTTP-pyyntöjä backendiin
// 4.8 blogilistan testit step1 OK
// SuperTest-kirjastolla testit blogilistan osoitteeseen /api/blogs tapahtuvalle HTTP GET ‑pyynnölle
// -> testi: 'all blogs are returned as json'
// 4.9 blogilistan testit step2 OK
// palautettujen blogien identifioivan kentän tulee olla nimeltään id; teht 4.9
// -> testi: 'all blogs are identified by id'
// 4.10 blogilistan testit step3 OK
// testi sovellukseen voi lisätä blogeja osoitteeseen /api/blogs tapahtuvalla HTTP POST ‑pyynnöllä
// -> testi: 'a valid blog can be added'


const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
  
// tyhjennetään blogilista aina aluksi
beforeEach(async () => {  
    await Blog.deleteMany({})  
    await Blog.insertMany(helper.initialBlogs)
})

// SuperTestin mekanismeja käyttävä testi HTTP GET ‑pyynnölle; teht 4.8
test('all blogs are returned as json', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// testi: palautettujen blogien identifioivan kentän tulee olla nimeltään id; teht 4.9
test('all blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
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

// testi sovellukseen voi lisätä blogeja osoitteeseen /api/blogs tapahtuvalla HTTP POST ‑pyynnöllä; teht 4.10
// testataan myös titlen oikeellisuus tallennuksen jälkeen
test('a valid blog can be added', async () => {
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
