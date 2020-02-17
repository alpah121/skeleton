var express = require('express');
var router = express.Router();
var passport = require("passport");
var navbar = [];


function getSQLResponse(fallback, sql)
{
//make query
connection.query(sql, (error, results, fields) => {
	//handle error
	if (error) {}
	//return results
	
	});
}


router.get('/', function(req, res) {
	res.render('home');
	});


router.get('/signUp', (req, res) => {
res.render('signIn');	
});

router.get('/login', (req, res) => {
res.render('login');	
});

router.post('/signUp', passport.authenticate('local.signUp', {
successRedirect: '/login',
failureRedirect: '/signUp',
failureFlash: true	
}));

router.post('/login', passport.authenticate('local.login', {
successRedirect: '/dashboard',
failureRedirect: '/login',
failureFlash: true	
}));

router.get('/logout', isLoggedIn, function(req, res, next) {
req.logout();
res.redirect('/');	
});

router.get('/editor', function(req, res) {
	res.render('editor');
});

router.get('/payment', function(req, res) {
	res.render('payment');
}); 

router.get('/test', function (req, res) {
	res.render('test');
});
function isLoggedIn(req, res, next)
{
if (req.isAuthenticated())
	{
	return next();		
	}
else
	{
	res.redirect('/');	
	}
}

module.exports = router;
