exports.indexRoute = function(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.render('index', { title: 'Partyfy' });
}