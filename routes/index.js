var express = require('express')
var app = express()

app.get('/books/search',isLoggedIn, function(req, res) {
	res.render('books/search', {
		title_name: 'Search books',
		data: '',
		keyword :''
	})
})

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/users/login');
}

module.exports = app;
