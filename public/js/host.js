var Host
$(document).ready(function(){
	Host = {
		socket : null,
		videoActual : {
			obj: null, 
			indice: null, 
		},
		reproductor : null,
		cola : null,
		playing : false,

		el : {
			listaReproduccion : $("#lista-reproduccion"),
			vacio : $("#vacio"),
			controls: $("#controls"),
			videoWrapper: $("#videoWrapper"),
			prevBtn: $("#controls i.fi-previous"),
			nextBtn: $("#controls i.fi-next")
		},
		
		iniciar : function(){
			this.conectarSocket();
			this.asociarEventos();
		},

		conectarSocket : function(){
			//this.socket = io('ws://partyfy-spaceapp.rhcloud.com:8000/host');
			this.socket = io('/host');
		},

		asociarEventos : function(){
			this.socket.on('connect', $.proxy(this.pedirVideos, this))
			this.socket.on("videos", $.proxy(this.armarPlaylist, this));
			this.socket.on("agregar video", $.proxy(this.anadirVideo, this));
			this.socket.on('mensaje', $.proxy(this.anadirMensaje, this));


			this.el.prevBtn.click(prevVideo)
			this.el.nextBtn.click(nextVideo)
		},

		armarPlaylist : function(videos){
			var htmlvid = ""
			
			if (videos != null) {
				if ( videos.length > 0) {
					this.cola = videos;
					this.videoActual.obj = videos[0];
					this.videoActual.indice = 0;

					htmlvid = armarFooter(videos, htmlvid);
					this.construirReproductor();
					this.el.listaReproduccion.append(htmlvid);
					
					this.el.videoWrapper.removeClass("hide")
					this.el.vacio.addClass("hide")

					console.log(this.cola)
				}

				else{
					this.el.vacio.removeClass("hide")
				}
			}

			else{
				this.el.vacio.removeClass("hide")
			}
		},

		pedirVideos : function(){
			this.socket.emit("pedir videos");
		},

		anadirVideo : function(video){
			this.cola.push(video);
			console.log(this.cola);
			var html = buildVideo(video);
			this.el.listaReproduccion.append(html);


			if (this.videoActual == null) {
				this.videoActual.obj = video;
				this.videoActual.indice = 0;
				this.construirReproductor();
				this.el.vacio.addClass("hide");
			}

			if (!this.playing) {
				this.videoActual.indice = this.videoActual.indice + 1;
				this.videoActual.obj = video;
				player.loadVideoById(video.id, "large");
				this.playing = true;
			}

		},

		anadirMensaje : function(mensajes){
			console.log(mensajes)
			showMessage(mensajes);
		},

		escapar : function(texto){
			return String(texto)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
		},

		construirReproductor : function(){
			this.playing = true;
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			this.el.controls.removeClass("hide")

			
		},

	};
});