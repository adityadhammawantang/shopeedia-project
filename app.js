var express 		= require('express'),
	app 			= express(),
	mongoose		= require('mongoose'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	bodyParser		= require('body-parser'),
	methodOverride 	= require('method-override');

var Comment		= require('./models/Comment'),
	Product 	= require('./models/Product'),
	Transaction = require('./models/Transaction'),
	User		= require('./models/User');

app.set("view engine", "ejs");

app.use(require("express-session")({
	secret: "Tugas IF3152 - Rekayasa Perangkat Lunak",
	resave: false,
	saveUninitalized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
	res.send("This is the index page");
})

app.listen("3152", function(req, res){
	console.log("Shopeedia server is up and running!");
})