
var mongoose = require('mongoose');

module.exports = mongoose.model('CartItem',{
	title: String,
	description: String,
	price: Number,
	category: String,
    qty:Number,
    imgpath:String
});