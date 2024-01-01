// teht 4.2 blogilista step2
// eristetään konsoliin tulostelu omaan moduliinsa
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {     
      console.log(...params)  
    }
  }
  
  const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {     
      console.error(...params)  
    }
  }
  
  module.exports = {
    info, error
  }