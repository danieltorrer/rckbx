var shortId = require('shortId');

exports.findSessionById = function(id){
	db.Session.find({ room : id }).exec(function (error, session){
		if (error){
			console.log(error)
			return null;
		}
		else
			return session;
	})	
}

exports.findAll = function(){
	db.Session.find().exec(function (error, session){
		if (error){
			console.log(error)
			return null;
		}
		else
			return session;
	})	
}

exports.createSession = function(){
	var tempId;

	do{
		tempId = shortId.generate();
		tempId = tempId.substring(0,4);
	}
	while( findSessionById(tempId) != null);

	//sessions[tempId] = new session();

	var newSession = new db.Session({
		room:  tempId
	})

	var response = tempId;

	newSession.save(function(error, session){
		if (error){
			response = null;
			console.log(error)
		}
	})

	return response;

	//sessions[tempId].room = tempId;
	//console.log(sessions[tempId])
};