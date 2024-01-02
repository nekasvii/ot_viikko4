// Teht 4.16 blogilistan laajennus step4 OK
// käyttäjätunnuksen ja salasanan oltava väh. 3 merkkiä pitkiä 
// -> testi: 'new user, when conflict with username fails with 400'
// käyttäjätunnuksen oltava uniikka 
// -> testi: 'new user, when conflict with username fails with 400'
// salasanan oltava väh. 3 merkkinen
// -> testi: 'password must be min. 3 characters long or fails with 400'
// käyttäjätunnuksen oltava väh. 3 merkkinen
// -> testi: 'username must be min. 3 characters long or fails with 400'

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// tyhjennetään blogilista aina aluksi
// describen ulkopuolella, jotta toteutetaan tarpeeksi usein
beforeEach(async () => {  
    await Blog.deleteMany({})  
    await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
    // SuperTestin mekanismeja käyttävä testi HTTP GET ‑pyynnölle; teht 4.8
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
})

describe('viewing a specific blog and its detiles', () => {
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

    // testi: palautettujen blogien identifioivan kentän tulee olla nimeltään id; teht 4.9
    test('all blogs are identified by id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

 
describe('deletion of a note', () => {
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
})
/*
describe('adding content', () => {
    // testi sovellukseen voi lisätä blogeja osoitteeseen /api/blogs tapahtuvalla HTTP POST ‑pyynnöllä; teht 4.10
    // testataan myös titlen oikeellisuus tallennuksen jälkeen
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Katsaus päättyneeseen geokätköilyvuoteen 2023',   
            author: 'weellu',
            url: 'https://www.6123tampere.com/2024/01/01/katsaus-paattyneeseen-geokatkoilyvuoteen-2023/',
            likes: 3
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

    // testi tarkistaa, että jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0
    test('if no likes value given, value is 0', async () => {
        const newBlog = {
            title: 'Hämärää touhua',
            url: 'https://www.hamaraatouhua.fi/'
        }
        
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd.find(b => b.title === 'Hämärää touhua')
        expect(addedBlog.likes).toBe(0)
    })

    // testi osoitteeseen /api/blogs tapahtuvalle HTTP POST ‑pyynnölle jotka varmistavat, että jos uusi 
    // blogi ei sisällä kenttää title tai url, pyyntöön vastataan statuskoodilla 400 Bad Request.
    test('HTTP POST without title or url gives 400 Bad Request', async () => {
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
})

// tallennetun tiedon muuttaminen yksittäisessä blogimerkinnässä
describe('editing content', () => {
    test('editing likes', async () => {
        const newBlog = {
            title: 'Hämärää touhua',
            url: 'https://www.hamaraatouhua.fi/',
            likes: 1
        }

        const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const createdBlog = response.body
        const updatedBlog = {
            ...createdBlog,
            likes: createdBlog.likes + 1
        }

        await api
        .put(`/api/blogs/${createdBlog.id}`)
        .send(updatedBlog)
        .expect(200)

        const updatedResponse = await api.get(`/api/blogs/${createdBlog.id}`)
        expect(updatedResponse.body.likes).toBe(createdBlog.likes + 1)
    })   

})*/

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('expected `username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    // käyttäjätunnuksen oltava uniikki
    test('new user, when conflict with username fails with 400', async () => {
        const newUser = {
            username: 'hillapellolla',
            name: 'Hilla Pelto',
            password: 'salasana',
          }
      
          await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

          const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
      
          expect(result.body.error).toContain('User validation failed: username: Error, expected `username` to be unique. Value: `hillapellolla`');
    })

    // käyttäjätunnuksen oltava väh. 3 merkkinen
    test('username must be min. 3 characters long or fails with 400', async () => {
        const newUser = {
            username: 'ei',
            name: 'Elina Ilola',
            password: 'salasana',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username and password must be minimum 3 characters long');
    });

    // salasanan oltava väh. 3 merkkinen
    test('password must be min. 3 characters long or fails with 400', async () => {
        const newUser = {
            username: 'validusername',
            name: 'Short Password',
            password: 'ei',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('username and password must be minimum 3 characters long');
    });
  })

//Async/await-syntaksin käyttö liittyy siihen, että palvelimelle tehtävät pyynnöt ovat asynkronisia operaatioita
afterAll(async () => {
  await mongoose.connection.close() // katkaistaan vielä Mongoosen käyttämä tietokantayhteys
})
