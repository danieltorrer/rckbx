module.exports = function(mongoose) {

	var Schema = mongoose.Schema;

  	// Objeto modelo de Mongoose
  	var UserSchema = new Schema({

		// Propiedad nombre
		room : String, // tipo de dato cadena de caracteres

		// Propiedad fecha de nacimiento
		date : { type: Date, default: Date.now }, // tipo de dato fecha
		active : { type: Boolean, default: true },
		usuarios : [],
		mensajes : [],
		videos : []
	});

  	return mongoose.model('Session', UserSchema);
  }