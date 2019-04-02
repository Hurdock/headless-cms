var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: String,
  icon: String,
  data: Array,
  forms: Array
});

var collection = mongoose.model('contents', schema);

module.exports = collection;