// teht 4.4 apufunktioita ja yksikkötestejä step2 OK
// funktio totalLikes laskee liket yhteen

const dummy = (blogs) => {
    // ...saa taulukollisen blogeja ja palauttaa luvun 1
    return 1
}

const totalLikes = (blogs) => {
  // saa taulukollisen blogeja ja palauttaa blogien yht. tykkäysten määrän
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
  
module.exports = {
    dummy,
    totalLikes
}