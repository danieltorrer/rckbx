exports.playlistRoute = function(req, res) {

	//validate string before consulting db
	if ( pattern.test(""+req.params.id+"")) {
		console.log(req.params.id)
		var response = models.findSessionById(req.params.id)

		if (response != null) {
			res.setHeader('Content-Type', 'text/html');
			//res.cookie('name', req.params.id);
			res.cookie('session', response);
			//cookie2 = res.cookie;
			res.render('playlist', { title: 'Create playlist', room: res.cookie.session.room  });
		}

		else{
			console.log("no se encontro en la base")
			res.redirect('/');
		}
	}
	else{
		console.log("url invalida")
		res.redirect('/');
	}

}