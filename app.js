var express 		= require('express'),
	app 			= express(),
	mongoose		= require('mongoose'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	bodyParser		= require('body-parser'),
	methodOverride 	= require('method-override'),
	ejs				= require('ejs'),
	seedDB			= require('./seeds');

var Comment		= require('./models/comment'),
	Product 	= require('./models/product'),
	Transaction = require('./models/transaction'),
	User		= require('./models/user');

//MIDDLEWARES
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

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("/views"));
app.set("view engine", "ejs");``
mongoose.connect("mongodb://localhost/shopeedia");
//END OF MIDDLEWARES

//INDEX PAGE
//seedDB();

app.get("/", function(req, res){
	res.send("This is the index page");
})

//AUTHENTICATION
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register(new User({username : req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/catalogs");
        });
    });
});

app.get("/login", function(req, res){
	res.render("login")
});

app.post("/login", passport.authenticate("local", {
	successRedirect : "/catalog",
	failureRedirect : "/login"
	}), function(req, res) {
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});
//END OF AUTHENTICATION

//ROUTES FOR PRODUCTS AND CATALOG
app.get("/catalog", function(req, res){
	res.render("catalog");
});

app.listen("3152", function(req, res){
	console.log("Shopeedia server is up and running!");
})