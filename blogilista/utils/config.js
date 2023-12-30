// teht 4.2 blogilista step2
// ympäristömuuttujien käsittely
const dotenv = require('dotenv') // npm install dotenv
dotenv.config();

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}