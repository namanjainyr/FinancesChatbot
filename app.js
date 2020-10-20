var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var DialogFlow = require('./lib/NLP');
const uuid = require('uuid');
var socketio = require('./lib/socket')(io, uuid, DialogFlow);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const passport = require('passport');
var config = require("./Utilities/config");
var UserDetail = require("./Models/UserDetail");
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes/index.route"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

//Setting up the static files location
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname));


//Setting connection with Mongo DB for authentication purpose
mongoose.connect(config.mongoDB_connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Authentication using passport
UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');
passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

//Setting Ejs View Engine
app.set('view engine', 'ejs');


//Turning on the server to receive the request on specified Port
http.listen(config.port, () => {
    console.log(config.serverListenMessage);
});