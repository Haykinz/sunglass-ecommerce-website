var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var CartItem = require('../models/cartitem');
var Address = require('../models/address');
var Billing = require('../models/billing');

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        res.render('index', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('register', { message: req.flash('message') });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // Display - Products Page.
    router.get('/listproducts', isAuthenticated, function (req, res, next) {
        Product.find(function (err, productlist) {
            if (err) {
                res.send(err);
            } else if (productlist.length) {
                console.log(productlist);
                res.render('listproducts', {
                    productlist: productlist
                });
            } else {
                res.render('listproducts');
                console.log('No documents found');
            }
        });

        // Display - Products Page.
        //Redirecting to a new page for editing particular product details.
        router.get('/listproducts/:productid/addtocart', isAuthenticated, function (req, res, next) {
            Product.findById(req.params.productid, function (err, doc) {
                console.log(req.params.productid);
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                    var newCartItem = new CartItem();

                    // set the new product details
                    newCartItem.title = doc.title;
                    newCartItem.description = doc.description;
                    newCartItem.price = doc.price;
                    newCartItem.category = doc.category;
                    newCartItem.qty = 1;
                    newCartItem.imgpath = doc.imgpath;
                    // save the product
                    newCartItem.save(function (err) {
                        if (err) {
                            console.log('Error in Saving product: ' + err);
                            throw err;
                        }
                        console.log('Added product into cart');
                        res.redirect('/listproducts');
                    });
                }
            });
        });
    });


    // Display - Cart Page.
    router.get('/cart', isAuthenticated, function (req, res, next) {
        CartItem.find(function (err, cartlist) {
            if (err) {
                res.send(err);
            } else if (cartlist.length) {
                console.log(cartlist);
                res.render('cart', {
                    cartlist: cartlist
                });
            } else {
                res.render('cart');
                console.log('No documents found');
            }
        });
    });

    //Deleting particular product from the database.
    router.get('/cart/:id/delete', function (req, res) {
        CartItem.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Removed Product');
                res.redirect('/cart');
            }

        });
    });


    // Display - Checkout Page.
    router.get('/checkout', isAuthenticated, function (req, res, next) {
        res.render('checkout');
    });

    // Display - Checkout Page.
    router.post('/checkout', isAuthenticated, function (req, res) {
        customerAddress = new Address;
        customerAddress.name = req.body.name;
        customerAddress.address = req.body.address;
        customerAddress.city = req.body.city;
        customerAddress.state = req.body.state;
        customerAddress.zip = req.body.zip;

        customerCC = new Billing;
        customerCC.cardtype = req.body.cctype;
        customerCC.name = req.body.ccname;
        customerCC.number = req.body.ccnumber;
        customerCC.expiremonth = req.body.ccexpmonth;
        customerCC.expireyear = req.body.ccexpyear;

        // save the product
        customerAddress.save(function (err) {
            if (err) {
                console.log('Error in Saving Address: ' + err);
                throw err;
            }
            console.log('Added address into database');
        });

        customerCC.save(function (err) {
            if (err) {
                console.log('Error in Saving CC: ' + err);
                throw err;
            }
            console.log('Added credit card into database');
        });

        res.redirect('/thankyou');
    });

    // Display - Checkout Page.
    router.get('/thankyou', isAuthenticated, function (req, res, next) {
        res.render('thankyou');
    });

    return router;
}





