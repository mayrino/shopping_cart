var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');

// setup route middlewares
var csrfProtection = csurf();

router.use(csrfProtection);

router.get('/profile', isLoggedIn,function(req, res, next) {
    Order.find({user:req.user}, function(err, orders){
      if(err){
        return res.write('error');
      }
      var cart;
      orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
       res.render('user/profile',{orders: orders});
    }); 
});

router.get('/logout',isLoggedIn, function(req,res,next){
    req.logOut();
    res.redirect('/');
});

router.use('/',notLoggedIn, function(req,res,next){
    next();
});

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}),function(req, res, next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
         res.redirect('/user/profile');
    }   
});

router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});
router.post('/signin', passport.authenticate('local.signin', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res ,next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
         res.redirect('/user/profile');
    }   
});


module.exports = router;


function isLoggedIn(req,res,next){     
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

function notLoggedIn(req,res,next){
    if(req.isUnauthenticated()){
        return next();
    }
    return res.redirect('/');
}
