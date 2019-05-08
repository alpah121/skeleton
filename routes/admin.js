var adminFunctions = {};

adminFunctions.main = function(req, res) {
res.send("this is the cool kids table");
};

adminFunctions.sub = function(req, res) {
res.send("this is the really cool kids table");
};


module.exports = adminFunctions;
