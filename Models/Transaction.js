const mongose = require('mongoose');

const transactionSchema = new mongose.Schema({
    senderAccountNumber: {
    type: String,
    required: true,
  },

    receiverAccountNumber: {
    type: String,
    required: true,
  },

    amount: {
    type: Number,
    required: true,
  },

  transactionType: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true,
  },

  channel: {
    type: String,
    enum: ['interBank', 'intraBank'],
    required: true,
  },
},
{timestamps: true}
);

const Transaction = mongose.model('Transaction', transactionSchema);
module.exports = Transaction;