const express = require('express');
const env = require('./config/environment.js');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers.js')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');


//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy.js');
const passportJWT = require('./config/passport-jwt-strategy.js');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware.js');
const path = require('path');

// setting up scss middleware to convert scss file into css before any page rendering  

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'/scss'),
        dest: path.join(__dirname,env.asset_path,'/css'),
        debug: true,
        outputStyle: 'expanded',
        prefix: '/css'
    }))
}
app.use(express.urlencoded());
app.use(express.json());

app.use(cookieParser());

app.use(express.static(env.asset_path));
// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))

// logger
app.use(logger(env.morgan.mode, env.morgan.options));

// tell the express that before rendering must use this layout
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// express-session setup
// mongo store is used to store the session in the db
app.use(session({
    name:'codeial',
    secret: env.session_cookie_key,  // by using this secret encryption and decryption is done
    saveUninitialized: false, // if user have not logged in so no need to store any data
    resave: false,            
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)
app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));



app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
