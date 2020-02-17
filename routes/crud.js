var express = require('express');
var router = express.Router();

var table = "items";
let tableTypes = {name : "string", description : "string"};
let tableFields = Object.keys(tableTypes);
let fallback = "/";


const types = {
	string : /w+/,
	number : /[0-9]/, 
	email : /\S+@\S+\.\S+/,
	phone : /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
	url : /^http/
}


function getAccessLevel(req)
{
if (req.session.job == "admin")
	{
	//admin
	return 3;	
	}
else if (req.session.job != undefined)
	{
	//employee
	return 2;	
	}
else if (req.session.id != undefined)
	{
	//user
	return 1;
	}
else
	{
	//guest
	return 0;	
	}
}

//read from database
router.get('/read', function (req, res) {
connection.query("SELECT * FROM " + table + ";", (error, results, fields) => {	
	res.json(results);
	});
});

//details about a single item
router.get('/detail', function (req, res) {
let id = connection.escape(req.query.id);
connection.query("SELECT * FROM " + table + " WHERE id='" + id + "';", (error, results, fields) => {	
	res.json(results);
	});
});

//check inputs
function checkInputs(typesObject, input)
{
let typesKeys = Object.keys(typesObject);
let inputKeys = [];
let inputValues = [];
let inputObjects = {};
let hasErrors = false;
let errors = [];

for(i = 0; i < typesKeys.length; i++)
	{
	let tableField = typesKeys[i];
	let tableType = typesObject[tableField];
	let type = types[tableType];
	let userInput = input[tableField];
	if (type.test(userInput)) 
		{
		inputKeys.push(tableField);	
		inputValues.push(connection.escape(userInput));
		inputObjects[tableField] = connection.escape(userInput);	
		}
	else
		{
		hasErrors = true;
		errors.push(tableField);	
		}
	}
return {hasErrors: hasErrors, errors: errors, inputKeys: inputKeys, inputValues: inputValues, inputObjects: inputObjects};
	
}

function sqlSET(inputs)
{
let result = "";
let keys = Object.keys(inputs);
let firstKey = keys[0];
let firstInput = inputs[firstKey];
result = firstKey + " = " + firstInput + " ";

if (keys.length > 1)
	{
	for(i = 0; i < keys.length; i++)
		{
		let key = keys[i];
		let input = inputs[key];
		result += ", " + key + " = " + input + " "; 		
		}
	}
return result;
}

//insert into database
router.post('/create', function(req, res) {
if (getAccessLevel(req) == 0) {res.redirect("/");}
let inputs = checkInputs(tableTypes, req.body);
if (inputs.hasErrors)
	{
	res.redirect(fallback);	
	}
else
	{
	let success = "/dashboard";
	connection.query("INSERT INTO " + table + " (" + inputs.inputKeys.toString(", ") + ") VALUES (" + inputs.inputValues.toString(", ") + ");", (error, results, fields) => {	
	res.redirect(success);
	});	
	}
});

//update the database
router.post('/update', function(req, res) {
if (getAccessLevel(req) == 0) {res.redirect("/");}

let inputs = checkInputs(tableTypes, req.body);
if (inputs.hasErrors)
	{
	res.redirect(fallback);	
	}
else
	{
	let success = "/dashboard";
	let sqlSET = sqlSET(inputs.inputObjects);	
	connection.query("UPDATE " + table + " SET " + sqlSET + " WHERE id = " + inputs.inputObjects["id"] + ";", (error, results, fields) => {	
	res.redirect(success);
	});	
	}
});


//delete from database
router.get('/delete', (req, res) => {
if (getAccessLevel(req) == 0) {res.redirect("/");}
let inputs = checkInputs(tableTypes, req.query);
if (inputs.hasErrors)
	{
	res.redirect(fallback);	
	}
else
	{
	let success = "/dashboard";
	let sqlSET = sqlSET(inputs.inputObjects);	
	connection.query("DELETE FROM " + table + " WHERE id = " + inputs.inputObjects["id"] + ";", (error, results, fields) => {	
	res.redirect(success);
	});	
	}
	
});

module.exports = router;
