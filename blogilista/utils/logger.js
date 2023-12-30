// teht 4.2 blogilista step2
// eristetään konsoliin tulostelu omaan moduliinsa
const info = (...params) => {
    console.log(...params)
  }
  
  const error = (...params) => {
    console.error(...params)
  }
  
  module.exports = {
    info, error
  }