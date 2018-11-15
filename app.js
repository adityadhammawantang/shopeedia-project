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
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");``
mongoose.connect("mongodb://localhost/shopeedia");

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})
//END OF MIDDLEWARES

//INDEX PAGE
//seedDB();

app.get("/", function(req, res){
	res.render("home");
});

//AUTHENTICATION
app.get("/register", function(req, res){
    res.render("register");
});

app.get("/profile", isLoggedIn, function(req, res){
	User.findById(req.user._id, function(err, theUser){
		if (err) {
			console.log(err);
		} else {
			console.log(theUser);
			res.render("profile", {user : theUser});
		}
	});
});

app.post("/register", function(req, res){
    User.register(new User({username : req.body.username, name: req.body.name, address : req.body.address, email : req.body.email, phone : req.body.phone}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("catalog");
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
	res.redirect("/login");
});

//END OF AUTHENTICATION

//ROUTES FOR PRODUCTS AND CATALOG
app.get("/catalog", function(req, res){
	Product.find({}, function(err, allProducts){
		if (err) {
			console.log(err);
		} else {
			res.render("catalog", {products: allProducts});
		}
	});
});

//havent made the front-end yet
app.get("/catalog/:id", function(req, res){
	Product.findById(req.params.id).populate('comments').exec(function(err, theProduct){
        if (err) {
            console.log("An error has occured");
        } else {
            res.render("catalog/show", {product: theProduct});
        }
    });
});

//END OF PRODUCTS AND CATALOGS

//ROUTES FOR PAYMENT AND CHECKOUT

app.get("/checkout", function(req, res){
	res.render("checkout");
});

//ROUTES FOR PROFILE, CART, AND HISTORY

app.get("/cart", function(req, res){
	
});

//END OF PROFILE, CART, AND HISTORY


//FUNCTIONS
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
	}
    res.redirect("/login");
}

app.listen("3152", function(req, res){
	console.log("Shopeedia server is up and running!");
});