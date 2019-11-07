var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: String,
	isbn: String,
	author: String,
	category: String
});

var SavedBookList = new Schema({
	userid: String,
	book_id: String,
	title: String,
	isbn: String,
	author: String,
	category: String
});

const Book = mongoose.model('Book', BookSchema);
const SavedBook = mongoose.model('SavedBook', SavedBookList);
module.exports = {SavedBook, Book};

