var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var Product = require('../models/products');

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Welcome Administrator")
});

// Get Admin - Products Page.
router.get('/products', function (req, res, next) {
    Product.find(function (err, productlist) {
        if (err) {
            res.send(err);
        } else if (productlist.length) {
            res.render('admin/products', {
                productlist: productlist
            });
        } else {
            res.render('admin/products');
            console.log('No documents found');
        }
    });
});


// Adding new products to the product database.
router.post('/products', function (req, res) {
    var newProduct = new Product();
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var img = files.images[0];
        fs.readFile(img.path, function (err, data) {
            var path = "./public/images/" + img.originalFilename
            fs.writeFile(path, data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Upload success');
                }
            });
        })
        
        // set the new product details
        newProduct.imgpath = "/images/" + files.images[0].originalFilename;
        newProduct.title = fields.title[0];
        newProduct.description = fields.description[0];
        newProduct.price = fields.price[0];
        newProduct.category = fields.category[0];

        console.log(newProduct);
        // save the product
        newProduct.save(function (err) {
            if (err) {
                console.log('Error in Saving product: ' + err);
                throw err;
            }
            console.log('Added new product into database');
            res.redirect('/admin/products');
        });
    })
});

//Deleting particular product from the database.
router.get('/products/:id/delete', function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Removed Product');
            res.redirect('/admin/products');
        }

    });
});

//Redirecting to a new page for editing particular product details.
router.get('/products/:id/edit', function (req, res) {
    Product.findById(req.params.id, function (err, editproduct) {
        if (err) {
            console.log(err);
        } else {
            console.log(editproduct.title);

            var needsEdit = new Product();
            needsEdit.title = editproduct.title;
            needsEdit.description = editproduct.description;
            needsEdit.price = editproduct.price;
            needsEdit.category = editproduct.category;
            console.log(needsEdit);

            res.render('admin/editproduct', { needsEdit: needsEdit });
        }
    });
});

// Updating the product details to the product database.
router.post('/products/:id/edit', function (req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Updated product');
            res.redirect('/admin/products');
        }
    });

});

module.exports = router;