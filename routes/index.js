var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {
        var successMsg = req.flash('success')[0];
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'ShoppingCart', products: productChunks ,successMsg: successMsg, noMessages: !successMsg });
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return next(err);
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.info(req.session.cart);
        res.redirect('/');

    });

});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');

});

router.get('/removeItem/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');

});

router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { prducts: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn , function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];    
    res.render('shop/checkout', { total: cart.totalPrice, errMsg:errMsg, noErrors:!errMsg });
});

router.post('/checkout', isLoggedIn , function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_pbszeNXzM2KalArTHNYB0IJR");

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.stripeToken; // Using Express

    // Charge the user's card:
    var charge = stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        description: "Example charge",
        source: token,
    }, function(err, charge) {        
        if(err){
          req.flash('error', err.message);
          return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            payment: charge.id  
        });
        console.log(req.body.address);
        order.save(function(err, result){
            if(err){
                req.flash('error', err.message);
                return res.redirect('/checkout');
            }
            req.flash('success', 'Successful bought product');
            req.session.cart=null;
            res.redirect('/');
        });
        
    });
});

module.exports = router;

function isLoggedIn(req, res, next){     
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    return res.redirect('/user/signin');
}
