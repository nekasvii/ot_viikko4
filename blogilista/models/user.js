// Teht 4.15 blogilistan laajennus step3
// HTTP POST ‑pyyntö osoitteeseen api/users
// Käyttäjillä on käyttäjätunnus, salasana ja nimi
// salasanat bcrypt-kirjaston avulla laskettuna hash'inä

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {    
        type: String,    
        required: true,    
        unique: true  
    },  
    name: String,
    passwordHash: String,
     blogs: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        default: []
        }
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
  })
  
  const User = mongoose.model('User', userSchema)
  
  module.exports = User