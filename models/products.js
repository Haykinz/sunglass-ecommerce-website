
var mongoose = require('mongoose');

module.exports = mongoose.model('Product',{
	title: String,
	description: String,
	price: Number,
	category: String,
    imgpath:String
});