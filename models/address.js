
var mongoose = require('mongoose');

module.exports = mongoose.model('Address',{
	name: String,
	address: String,
	city: String,
	state: String,
    zip:String
});