// teht 4.5 apufunktioita ja yksikkötestejä step3 OK
// favoriteBlog-funktio selvittää blogin, jolla eniten tykkäyksiä

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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}