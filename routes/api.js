var express = require('express');
var router = express.Router();

var part = require('../models/part');


//admin inserts parts into database
router.post('/create', function(req, res) {
	req.check('imagePath', 'invalid image path').isLength({min: 4});
	req.check('name', 'invalid name').isLength({min: 4});
	req.check('goesTo', 'invalid goesTo').isLength({min: 4});
	req.check('keywords', 'invalid keywords').isLength({min: 4});
	var errors = req.validationErrors();
	if (errors)
		{req.session.errors = errors;}
	res.redirect('/create')
	});
//crawler(api key) inserts parts into database

//delete products from database


module.exports = router;
