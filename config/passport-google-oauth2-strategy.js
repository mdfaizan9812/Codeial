const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user.js');
const env = require('./environment.js')


// tell the passport to use google authentication
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    // callback function
    function(accessToken,refreshToken,profile,done){  // profile contain google users info
        // find user into database
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log("Error in google strategy passport",err); return}
            if(user){
                return done(null,user);
            }else{
                // if user not in database just create
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    passport:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log("Error in google strategy passport",err); return}
                    return done(null,user);
                })
            }
        })

    }
));

module.exports = passport;