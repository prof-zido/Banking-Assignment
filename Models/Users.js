const mongose = require('mongoose');

const userSchema = new mongose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },

  dateOfBirth: {
    type: String,
    required: true, 
  },

    phoneNumber: {
    type: String,
    required: true,
    unique: true, 
 }, 

  email: {
    type: String,
    required: true,
    unique: true,
  },

    password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  hasAdminAccess: {
    type: Boolean,
    default: false,
  },
  
}, 
{timestamps: true}
);

const User = mongose.model('User', userSchema);

module.exports = User;