const express = require('express');
const bodyParser = require('body-parser');
const signupRoute = require('./routes/signup');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');
app.set('views', 'views')


app.use(signupRoute);

app.listen(3000);