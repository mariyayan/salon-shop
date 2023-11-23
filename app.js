const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const productRoutes = require('./routes/product-routes');
const cartWishlistRoutes = require('./routes/cart-wishlist-routes');
const regAuthLogoutRoutes = require('./routes/reg-auth-logout-routes');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(__dirname + "/public/"));

app.use(productRoutes);
app.use(cartWishlistRoutes);
app.use(regAuthLogoutRoutes);

const hbs = require("hbs");
const expressHbs = require("express-handlebars");
app.engine("hbs", expressHbs.engine({
    layoutsDir: "views/layouts",
    defaultLayout: "layout",
    extname: "hbs"
}))
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + "/views/partials");


app.listen(port, () => {
    console.log(`Example app listening at http://127.0.0.1:${port}`)
});