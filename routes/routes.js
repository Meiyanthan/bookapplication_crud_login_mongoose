var User = require('../models/user');
module.exports = function(app, passport){
	app.get('/', function(req, res){
		res.render('users/index');
	});

	app.get('/users/login', function(req, res){
		res.render('users/login', { message: req.flash('loginMessage') });
	});
	app.post('/users/login', passport.authenticate('local-login', {
		successRedirect: '/books/search',
		failureRedirect: '/users/login',
		failureFlash: true
	}));

	app.get('/users/signup', function(req, res){
		res.render('users/signup', { message: req.flash('signupMessage') });
	});


	app.post('/users/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/users/signup',
		failureFlash: true
	}));

	app.get('/users/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/users/login');
}
