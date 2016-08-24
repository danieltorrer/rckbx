var Playlist
$(document).ready(function(){
	Playlist = {
		socket : null,
		usuario : null,
		listaReproduccion : null,
		videoActual : null,
		el : {
			listaUsuarios : $('#conectados ul'),
			listaReproduccion : $('#lista-reproduccion'),
			botonEnviar : null
		},
		
		iniciar : function(){
			this.conectarSocket();
			this.asociarEventos();
		},

		conectarSocket : function(){
			//this.socket = io('ws://partyfy-spaceapp.rhcloud.com:8000/playlist');
			this.socket = io('/playlist');
		},

		asociarEventos : function(){
			//this.socket.on('desconexion', $.proxy(this.eliminarUsuarioDeChat, this));
			this.socket.on('mensaje', $.proxy(this.anadirMensaje, this));
			this.socket.on('agregar video', $.proxy(this.anadirVideo, this));
			this.socket.on('conexion', $.proxy(this.anadirUsuarioAChat, this));
			$(document).on('click', '.add-btn', $.proxy(this.enviarVideo, this ) )
		},

		enviarConexion : function(usuario){
			this.usuario = usuario;
			this.socket.emit('conectar', { usuario: this.usuario });
		},

		anadirUsuarioAChat : function(videos){
			this.listaReproduccion = videos
			if (videos !=  null || typeof videos != 'undefined') {
				if ( videos.length > 0) {
					var htmlvid = armarFooter(videos)
					this.el.listaReproduccion.append(htmlvid)
				}
			}	
		},

		anadirMensaje : function(mensajes){
			showMessage(mensajes)
		},

		anadirVideo : function(video){
			html = buildVideo(video);
			this.el.listaReproduccion.append(html);
		},

		enviarVideo : function(e){
			e.preventDefault();
			var video = {
				idVideo : this.escapar( e.target.getAttribute("data-id") ),
				preview : e.target.getAttribute("data-img"),
				nombre : e.target.getAttribute("data-name")
			}

			this.socket.emit('video', video);
		},

		enviarMensaje : function(e){
			e.preventDefault();

			this.socket.emit('mensaje', {
				mensaje : this.escapar( e.target.getAttribute("data-id") )
			});
		},

		escapar : function(texto){
			return String(texto)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
		}

	};
});