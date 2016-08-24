exports.pedirVideos = function(videos, socket, hostU){
	socket.emit('videos', videos)
};