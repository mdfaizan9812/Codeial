const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt; // extract jwt token from header
const User = require('../models/user.js');
const env = require('./environment.js')

var opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}


// verify
passport.use(new JWTStrategy(opts,function(jwtpayload,done){
    User.findById(jwtpayload._id,function(err,user){
        if(err){console.log('Error in JWTStrategy',err); return}
        if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    });
}));

module.exports = passport;