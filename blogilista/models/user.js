// Teht 4.16 blogilistan laajennus step4 OK
// käyttäjätunnuksen ja salasanan oltava väh. 3 merkkiä pitkiä OK
// käyttäjätunnuksen oltava uniikka OK
// luomisoperaatiolle sopivat statuskoodit palautukseen OK: middlewaressa
// testit OK

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {    
        type: String,    
        required: true,
        minlength: 3,    
        unique: true 
    },  
    name: String,
    passwordHash: {
        type: String,    
        required: true,
        minlength: 3
    },
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