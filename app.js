var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var port = process.env.PORT || 3000;


var configDB = require('./config/database.js');
mongoose.connect(configDB.url,{useUnifiedTopology: true, useNewUrlParser: true });
require('./config/passport')(passport);



//app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());


var books = require('./routes/books');
var index = require('./routes/index');


app.set('view engine', 'ejs');


require('./routes/routes')(app, passport);
app.use('/', index);
app.use('/', books);
app.use('/books', books);
app.use('/books/add', books);
app.use('/search', books);


app.get('/', function(req, res){
    console.log('app starting on port: '+port)
    res.send('working');
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});
