const mongose = require('mongoose');

const accountSchema = new mongose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  NIN: {
    type: String,
    required: true,
    unique: true,
  },

  accountBalance: {
    type: Number,
    required: true,
    default: 0,
  },
},
{timestamps: true}
);

const Account = mongose.model('Account', accountSchema);
module.exports = Account;