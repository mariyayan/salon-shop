const { User } = require('../models/User');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


const setJWTAndRefreshTokens = async function(user, res, req) {
    let [jwt, jwtExpiration] = user.generateJWTToken();
    let refreshToken = user.generateRefreshToken();
    await user.save();
    await mongoose.disconnect();
    res.cookie('jwt', jwt, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
    res.cookie('jwtExpiration', jwtExpiration, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
    res.cookie('refreshToken', refreshToken, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
    res.json({ 'navmenu': 'true' });
}


const unsetJWTAndRefreshTokens = function(res) {
    res.clearCookie('refreshToken');
    res.clearCookie('jwt');
    res.clearCookie('jwtExpiration');
};


const registerUser = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let isUserExists = await User.isLoginExists(req.body.login);
    if (isUserExists) {
        await mongoose.disconnect();
        return res.json({ 'form': 'Пользователь с таким логином уже существует', 'errorType': 'login' });
    }
    let user = await User.create({ login: req.body.login });
    user.setPassword(req.body.password);
    let wishlist = await Wishlist.create({ user: user._id });
    let cart = await Cart.create({ user: user._id });
    req.session.showUserNavMenu = true;
    await setJWTAndRefreshTokens(user, res, req);
};


const authenticateUser = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.isLoginExists(req.body.login);
    if (!user) {
        await mongoose.disconnect();
        return res.json({ 'form': 'Пользователя с таким логином не существует', 'errorType': 'login' });
    }
    let passwordValidationResult = user.validatePassword(req.body.password);
    if (!passwordValidationResult) {
        await mongoose.disconnect();
        return res.json({ form: 'Неверный пароль', 'errorType': 'password' });
    }

    req.session.showUserNavMenu = true;
    await setJWTAndRefreshTokens(user, res, req);
};


const logoutUser = async function(req, res) {
    unsetJWTAndRefreshTokens(res);
    req.session.showUserNavMenu = false;
    res.redirect('/');
};


const refreshToken = async function(req, res, next) {
    let jwtExpiration = req.cookies['jwtExpiration'];
    let nowTime = new Date();
    let timeDifference = Math.round((jwtExpiration - nowTime) / 60000);

    if (timeDifference <= 15) {
        unsetJWTAndRefreshTokens(res);
        await mongoose.connect("mongodb://0.0.0.0:27017/");
        let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
        setJWTAndRefreshTokens(user, res, req); 
    }
    next();
};


module.exports = {
    registerUser,
    authenticateUser,
    logoutUser,
    refreshToken,
};
