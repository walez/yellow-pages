// grab the mongoose module
var mongoose = require('mongoose');

var businessSchema = new mongoose.Schema({
    name         : String,
    address      : String,
    state        : String,
		description  : String,
    imgUrl       : String
});

module.exports = mongoose.model('Business', businessSchema);
