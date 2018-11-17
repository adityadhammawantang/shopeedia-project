var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	ejs = require('ejs'),
	seedDB = require('./seeds'),
	flash = require('connect-flash');

var Comment = require('./models/comment'),
	Product = require('./models/product'),
	Transaction = require('./models/transaction'),
	User = require('./models/user');

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

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/shopeedia");

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.flashError = req.flash("flash-error");
	res.locals.flashSuccess = req.flash("flash-success");
	next();
})
//END OF MIDDLEWARES

//INDEX PAGE
//seedDB();

app.get("/", function (req, res) {
	res.redirect("/catalog");
});

//AUTHENTICATION
app.get("/register", function (req, res) {
	res.render("register");
});

app.get("/profile", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, theUser) {
		if (err) {
			console.log(err);
		} else {
			res.render("profile", { user: theUser });
		}
	});
});

app.post("/register", function (req, res) {
	User.register(new User({ username: req.body.username, name: req.body.name, address: req.body.address, email: req.body.email, phone: req.body.phone }), req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function () {
			res.redirect("catalog");
		});
	});
});

app.get("/login", function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/catalog")
	} else {
		res.render("login")
	}
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/catalog",
	failureRedirect: "/login"
}), function (req, res) {
});

app.get("/logout", function (req, res) {
	req.logout();
	req.flash("flash-success", "Successfully logout");
	res.redirect("/login");
});

//END OF AUTHENTICATION

//ROUTES FOR PRODUCTS AND CATALOG
app.get("/catalog", function (req, res) {
	Product.find({}, function (err, allProducts) {
		if (err) {
			console.log(err);
		} else {
			res.render("catalog", { products: allProducts });
		}
	});
});

app.get("/catalog/add", function (req, res) {
	res.render("addProduct");
})

//havent made the front-end yet
app.get("/catalog/:id", function (req, res) {
	Product.findById(req.params.id).populate('comments').exec(function (err, theProduct) {
		if (err) {
			console.log("An error has occured");
		} else {
			res.render("show", { product: theProduct });
		}
	});
});


app.post("/catalog", isAdmin, function (req, res) {
	var newProduct = req.body.product;
	Product.create(newProduct, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('catalog');
		}
	})
});

//END OF PRODUCTS AND CATALOGS

//ROUTES FOR ADMIN FUNCTIONS
app.get("/dashboard", function (req, res) {
	res.render("dashboard");
});

//END OF ADMIN FUNCTION

//ROUTES FOR PAYMENT AND CHECKOUT

app.get("/checkout", function (req, res) {
	User.findById(req.user._id, function (err, theUser) {
		if (err) {
			console.log(err);
		} else {
			if (!Array.isArray(theUser.cart) || !theUser.cart.length) {
				res.redirect('back');
				req.flash("flash-error", "Anda belum memiliki belanjaan");
			} else {
				var productList = [];
				var subtotal = 0;
				theUser.cart.forEach(function (cartItem, index, array) {
					Product.findById(cartItem.product, function (err, cartProduct) {
						if (err) {
							console.log(err);
						} else {
							var p = {
								productName: cartProduct.productName,
								quantity: cartItem.quantity,
								sub: cartProduct.price * cartItem.quantity
							}
							productList.push(p);
							subtotal += cartProduct.price * cartItem.quantity;

							if (index === array.length - 1) {
								res.render("checkout", { user: theUser, cart: productList, total: subtotal })
							}
						}
					});
				});
			}
		}
	});
});

app.post("/checkout", function (req, res) {
	var newTransaction = {
		user: req.user._id,
		status: "confirmed",
		sum: req.body.sum,
		date1: new Date()
	}

	//var date = timestamp.getDate() + "-" + (timestamp.getMonth()+1) + "-" + timestamp.timestamp.getFullYear()
	Transaction.create(newTransaction, function (err, newT) {
		if (err) {
			console.log(err);
		} else {
			User.findById(req.user._id, function (err, theUser) {
				theUser.cart = [];
				theUser.save();
				console.log(theUser);
			});
			res.render("shipment", { transaction: newT });
		}
	});

});

//ROUTES FOR PROFILE, CART, AND HISTORY

app.get("/cart", isLoggedIn, function (req, res) {
	res.render("cart");
});

app.post("/cart/:id", isLoggedIn, function (req, res) {
	User.findById(req.user._id, function (err, theUser) {
		if (err) {
			console.log(err);
		} else {
			if (!Array.isArray(theUser.cart) || !theUser.cart.length) {
				newCart = [{
					product: req.params.id,
					quantity: req.body.order.quantity
				}];
				theUser.cart = newCart;
				theUser.save();
				req.flash("flash-success", "Added successfully to your cart");

			} else {
				addingCart = []
				theUser.cart.forEach(function (previousCart) {
					addingCart.push(previousCart);
				})
				newCart = {
					product: req.params.id,
					quantity: req.body.order.quantity
				};

				addingCart.push(newCart);
				theUser.cart = addingCart;
				theUser.save();
				req.flash("flash-success", "Added successfully to your cart");
			}
		}
	})
	res.redirect('back');
});
//END OF PROFILE, CART, AND HISTORY

//FUNCTIONS
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("flash-error", "Please Login First");
	res.redirect("/login");
}

function isAdmin(req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.username == "admin") {
			return next();
		} else {
			req.flash("flash-error", "You are not permitted to do this");
			res.redirect('back');
			return;
		}
	}
	req.flash("flash-error", "Please Login First");
	res.redirect("/login");
}

app.listen("3152", function (req, res) {
	console.log("Shopeedia server is up and running!");
});