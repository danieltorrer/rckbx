var crud = require('../models/crud')

exports.newRoute= function(req, res){
	
	var all = crud.findAll();
	console.log(all);
	/*var room = crud.createSession();
	
	//asignar cookie
	res.cookie('room', room);
	cookie = res.cookie;
	if (room != null) {
		res.redirect('/host/'+room);
	}
	else{
		res.render("error", { error: "Error: The URL doesn't exist :(" })
	}*/
}
