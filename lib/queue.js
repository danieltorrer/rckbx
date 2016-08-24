var helperUsuarios = require('../helpers/usuarios')

exports.conexion = function(socket, usuarios, datos, videos, hostU){
	var usuario = helperUsuarios.usuarioUnico(usuarios, datos.usuario)
	var temp = [];

	socket.usuario = usuario;
	temp.push(usuario);
	usuarios.push(usuario);

	var mensaje = [{
		'tipo' : 'info',
		'usuario' : null,
		'mensaje' : "<b>" + usuario + '</b> se ha unido'
	}]

	socket.emit('conexion', videos);

	socket.broadcast.emit('mensaje', mensaje);	
	hostU.emit('mensaje', mensaje);

};

exports.mensaje = function(socket, mensajes, usuario, datos, playlist){
	var mensaje = {
		'tipo' : 'normal',
		'usuario' : usuario,
		'mensaje' : datos.mensaje
	};

	playlist.emit('mensaje',[mensaje]);
	mensajes.push(mensaje);
};

exports.desconexion = function(socket,usuarios,usuario, hostU){
	usuarios.splice(usuarios.indexOf(usuario),1);

	//socket.broadcast.emit('desconexion',{ usuario: usuario });
	socket.broadcast.emit('mensaje',[{
		'tipo' : 'info',
		'usuario' : null,
		'mensaje' : usuario + ' ha salido'
	}]);

	hostU.emit('mensaje',[{
		'tipo' : 'info',
		'usuario' : null,
		'mensaje' : usuario + ' ha salido'
	}]);
};

exports.video = function(socket, usuario, datos, playlist, videos, hostU){
	
	var video = {
		'tipo' : 'video',
		'usuario' : usuario,
		'id' : datos.idVideo,
		'img' : datos.preview,
		'nombre' : datos.nombre
	};

	var mensaje = [{
		'tipo' : 'success',
		'usuario' : usuario,
		'mensaje' : "<b>" + datos.nombre + ' </b> se ha agregado a la lista'
	}]

	playlist.emit('agregar video', video);
	playlist.emit('mensaje', mensaje);

	hostU.emit("agregar video", video);
	hostU.emit('mensaje', mensaje )

	videos.push(video);
	
}