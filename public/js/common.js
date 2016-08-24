function armarFooter(videos){
	var htmlvid = ""
	$.each(videos, function(i, video){
		if (i == 0) {
			videoActual = video.id;
		}
		htmlvid += buildVideo(video)
		
	})

	return htmlvid;
}

function buildVideo(video){
	return  "<div class='item-queue usuario "+ video.usuario +"'>" +
	"<img src='"+ video.img+ "'>" +
	"<div><p>"+ video.nombre+ "</p></div>" +
	"</div>";
}

function showMessage(mensajes){

	$.each(mensajes, function(i, mensaje){

		switch (mensaje.tipo){

			case "info":
			Toast.info(mensaje.mensaje);
			break;

			case "success":
			Toast.success(mensaje.mensaje)
			break;

		}
	});
}