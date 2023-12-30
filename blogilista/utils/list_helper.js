// teht 4.6 apufunktioita ja yksikkötestejä step4 OK
// mostBlogs-funktio, joka selvittää kirjoittajan, jolla on eniten blogeja

const dummy = (blogs) => {
    // ...saa taulukollisen blogeja ja palauttaa luvun 1
    return 1
}

const totalLikes = (blogs) => {
  // saa taulukollisen blogeja ja palauttaa blogien yht. tykkäysten määrän
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  // saa taulukollisen blogeja ja palauttaa blogien yht. tykkäysten määrän
  if (blogs.length === 0) {
    return 0
  }

  const favorite = blogs.reduce((edellinen, nykyinen) => {
    return (edellinen.likes > nykyinen.likes) ? edellinen : nykyinen
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  // saa taulukon blogeja ja palauttaa kirjoittajan, jolla on eniten blogeja ja blogien lkm
  if (blogs.length === 0) {
    return 0
  }

  const authorCounter = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts;
  }, {})

  let maxBlogs = 0
  let busiestAuthor = ''

  for (const author in authorCounter) {
    if (authorCounter[author] > maxBlogs) {
      maxBlogs = authorCounter[author]
      busiestAuthor = author
    }
  }
  
  return {
    author: busiestAuthor,
    blogs: maxBlogs
  }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}