const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  borrower: String,
  dateBorrowed: String,
  dateReturned: String,
});

const itemSchema = new mongoose.Schema({
  name: String,
  borrower: { type: String, default: '' },
  borrowed: { type: Boolean, default: false },
  dateBorrowed: { type: String, default: '' },
  history: [historySchema],
  type: String, // either 'tool' or 'car'
});

module.exports = mongoose.model('Item', itemSchema);
