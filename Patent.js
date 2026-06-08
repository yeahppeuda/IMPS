const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  id: String,
  title: String,
  inventors: String,
  dept: String,
  status: String,
  date: String
});

module.exports = mongoose.model('Patent', patentSchema);