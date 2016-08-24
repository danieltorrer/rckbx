var crud = require('../models/crud');

exports.hostRoute = function(req, res) {
	console.log(req.params.id)
	var response = crud.findSessionById(req.params.id)
	console.log(response);
	if ( response != null ) {
		console.log("GET host " + req.params.id)
		res.setHeader('Content-Type', 'text/html');
		res.render('host', { title: 'Partyfy', room: req.cookies.room });
		cookie2 = req.cookies
	}
	else{
		res.redirect('/')
	}
}