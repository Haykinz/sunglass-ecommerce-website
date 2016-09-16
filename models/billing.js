
var mongoose = require('mongoose');

module.exports = mongoose.model('Billing',{
	cardtype: String,
	name: String,
	number: String,
	expiremonth: String,
    expireyear:Number
});