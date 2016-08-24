#!/bin/env node
//  OpenShift Node application
var express = require('express');
var fs      = require('fs');
var path 	= require('path');
var http 	= require('http');
//var socketio= require('socket.io');

var usuarios= [], mensajes = [], videos = [];
var queue   = require('./lib/queue');
var host   = require('./lib/host');
/**
 *  Define the application.
 */
 var App = function() {

	//  Scope.
	var self = this;

	/*  ================================================================  */
	/*  Helper functions.                                                 */
	/*  ================================================================  */

	/**
	 *  Set up server IP address and port # using env variables/defaults.
	 */
	 self.setupVariables = function() {
		//  Set the environment variables we need.
		self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
		self.port      = process.env.OPENSHIFT_INTERNAL_PORT ||
		process.env.OPENSHIFT_NODEJS_PORT || 8080;

		if (typeof self.ipaddress === "undefined") {
			//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
			//  allows us to run/test the app locally.
			console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
			self.ipaddress = "127.0.0.1";
		};
	};


	/**
	 *  Populate the cache.
	 */
	 self.populateCache = function() {
	 	if (typeof self.zcache === "undefined") {
	 		self.zcache = { 'index.html': '' };
	 	}

		//  Local cache for static content.
		self.zcache['index.html'] = fs.readFileSync('./index.html');
	};


	/**
	 *  Retrieve entry (content) from cache.
	 *  @param {string} key  Key identifying content to retrieve from cache.
	 */
	 self.cache_get = function(key) { return self.zcache[key]; };


	/**
	 *  terminator === the termination handler
	 *  Terminate server on receipt of the specified signal.
	 *  @param {string} sig  Signal to terminate on.
	 */
	 self.terminator = function(sig){
	 	if (typeof sig === "string") {
	 		console.log('%s: Received %s - terminating app ...',
	 			Date(Date.now()), sig);
	 		process.exit(1);
	 	}
	 	console.log('%s: Node server stopped.', Date(Date.now()) );
	 };


	/**
	 *  Setup termination handlers (for exit and a list of signals).
	 */
	 self.setupTerminationHandlers = function(){
		//  Process on exit and signals.
		process.on('exit', function() { self.terminator(); });
		//process.on('uncaughtException',  function() { self.terminator(); })
		//process.on('SIGTERM',  function() { self.terminator(); })
		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
		'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach(function(element, index, array) {
			process.on(element, function() { self.terminator(element); });
		});
	};


	/*  ================================================================  */
	/*  App server functions (main app logic here).                       */
	/*  ================================================================  */

	/**
	 *  Create the routing table entries + handlers for the application.
	 */
	 self.createRoutes = function() {

	 	self.routes = { };

	 	self.routes['/'] = function(req, res) {
	 		res.setHeader('Content-Type', 'text/html');
	 		res.render('index', { title: 'Partyfy' });
	 		//res.send(self.cache_get('index.html') );
	 	};

	 	self.routes['/playlist'] = function(req, res) {
	 		res.setHeader('Content-Type', 'text/html');
	 		res.render('playlist', { title: 'Create playlist' });
	 		//res.send(self.cache_get('index.html') );
	 	};

	 	self.routes['/host'] = function(req, res) {
	 		res.setHeader('Content-Type', 'text/html');
	 		res.render('host', { title: 'Partyfy' });
	 		//res.send(self.cache_get('index.html') );
	 	};


	 };


	/**
	 *  Initialize the server (express) and create the routes and register
	 *  the handlers.
	 */
	 self.initializeServer = function() {
	 	self.createRoutes();

	 	self.app = express();
	 	self.app.set('port', (process.env.PORT || 5000));

		//  Add handlers for the app (from the routes).
		for (var r in self.routes) {
			self.app.get(r, self.routes[r]);
		}

		self.app.set('views', path.join(__dirname, 'views'));
		self.app.set('view engine', 'pug');
		self.app.use(express.logger('dev'));
		self.app.use(express.json());
		self.app.use(express.urlencoded());
		self.app.use(express.methodOverride());
		self.app.use(express.static(path.join(__dirname, 'public')));

		if ('development' == self.app.get('env')) {
			self.app.use(express.errorHandler());
			console.log("env");
		}
	};


	/**
	 *  Initializes the application.
	 */
	 self.initialize = function() {
	 	//self.setupVariables();
	 	//self.populateCache();
	 	//self.setupTerminationHandlers();

		// Create the express server and routes.
		self.initializeServer();
	};


	/**
	 *  Start the server (starts up the application).
	 */
	 self.start = function() {
		//  Start the app on the specific interface (and port).
		self.server = http.Server(self.app);
		self.io = require('socket.io')(self.server);

		self.server.listen(self.app.get('port'), function() {
			console.log('%s: Node server started on :%d ...', Date(Date.now() ), self.app.get('port'));
		});

	};

	self.initializeSocketIO = function(){
		//self.server = http.createServer(self.app);

		self.playlist = self.io.of('/playlist');
		self.hostU = self.io.of('/host');

		return this;

	};

	self.addSocketIOEvents = function() {


		self.playlist.on('connection', function (socket) {

			console.log('playlist connection');

			socket.on("conectar", function (datos){
				queue.conexion(socket, usuarios, datos, videos, self.hostU);
			});

			socket.on("mensaje", function (datos){
				queue.mensaje(socket, mensajes, socket.usuario, datos, self.playlist);
			});

			socket.on("video", function (datos){
				queue.video(socket, socket.usuario, datos, self.playlist, videos, self.hostU);
			});

			socket.on("disconnect", function(){
				queue.desconexion(socket,usuarios,socket.usuario, self.hostU);
			});

		});

		self.hostU.on('connection', function (socket){

			console.log('host connection');

			socket.on("pedir videos", function(){
				host.pedirVideos(videos, socket, self.hostU);
			});

		});

	};

};	/*  Application.  */


/**
 *  main():  Main code.
 */
 var polygonus = new App();
 polygonus.initialize();
 polygonus.start();
 polygonus.initializeSocketIO().addSocketIOEvents();
