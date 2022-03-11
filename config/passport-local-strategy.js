const req = require('express/lib/request');
const res = require('express/lib/response');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js')

// tell the passport to use this local strategy
passport.use(new LocalStrategy({
    usernameField : 'email',      // tell username is email 
    },
    function(email,password,done){
        // find a user and establish an identity
        User.findOne({email:email}, function(err,user){
            if(err){
                console.log('Error in finding user ----> passport');
                return done(err); // pass this error to passport
            }
            if(!user || user.password != password){
                console.log('Invalid email/password');
                return done(null,false); // tell the passport, error is null and authentication is false
            }
            return done(null, user); // tell the passport, error is null and authentication is user
        })
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id) // set this user's id into cookies in encrypted format automatically
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){  // get id from cookies
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user ----> passport');
            return done(err);
        }
        return done(null,user);
    })
});

// check if the user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if user is signed-in, then pass on the request to the next funtion(controller's action)
    if(req.isAuthenticated()){ // isAuthenticated() is passport pre-defined function, put by passport in req when user logged in successfully
        return next();
    }
    // if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;