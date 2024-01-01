// teht 4.8 blogilistan testit step1
// 
const dotenv = require('dotenv') // npm install dotenv
dotenv.config();

let PORT = process.env.PORT

let MONGODB_URI = process.env.MONGODB_URI === 'test'
  ? process.env.TEST_MONGODB_URI  
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}