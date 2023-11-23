const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const getQuantitiesDifference = require('../helpers/cart-wishlist-helpers');
const { getMenuData, getCashedMenuData } = require('./product-controller');
const jwt = require('jsonwebtoken');
const { User, secretKey } = require('../models/User');
const mongoose = require('mongoose');

const addProduct = async function(cartWishlistOption, id, userId, productQuantity) {
    let product = await Product.findById(id);
    let cartOrWishlist;

    if (cartWishlistOption === 'cart') {
        cartOrWishlist = await Cart.findOne({ user: userId });
    } else if (cartWishlistOption === 'wishlist') {
        cartOrWishlist = await Wishlist.findOne({ user: userId });
    }

    let isProductAdded = cartOrWishlist.products.id(id);
    let quantity = productQuantity ? productQuantity : 1;

    if (!isProductAdded) {
        if (cartWishlistOption === 'cart') {
            let isQuantityEnough = product.isEnoughProductQuantity(quantity);
            if (!isQuantityEnough) {
                return ('Товара нет в наличии');
            }
            await product.changeQuantity(quantity);
        }

        await cartOrWishlist.addProduct(product, quantity);
        return ('Товар добавлен');
    } else if (isProductAdded) {
        let isQuantityEnough = product.isEnoughProductQuantity(quantity);
        if (!isQuantityEnough) {
            return ('Товара нет в наличии')
        }

        if (isProductAdded.quantity == quantity) {
            return ('Товар добавлен');

        }

        let [quantity2, increaseQuantityForCart, increaseQuantityForProduct] = getQuantitiesDifference(quantity, isProductAdded.quantity);

        if (increaseQuantityForCart) {

            let isQuantityEnough = product.isEnoughProductQuantity(quantity2);
            if (!isQuantityEnough) {
                return ('Товара нет в наличии');
            }

        }

        await cartOrWishlist.changeProductQuantity(product._id, quantity2, increaseQuantityForCart);
        await product.changeQuantity(quantity2, increaseQuantityForProduct);
        return ('Товар добавлен');
    }
}


const removeProduct = async function(opt, id, userId) {
    let cartOrWishlist;
    if (opt === 'cart') {
        cartOrWishlist = await Cart.findOne({ user: userId });

        let product = await Product.findById(id);
        let quantity = cartOrWishlist.products.id(id).quantity;
        await product.changeQuantity(quantity, true);

    } else if (opt === 'wishlist') {
        cartOrWishlist = await Wishlist.findOne({ user: userId });
    }

    await cartOrWishlist.products.id(id).remove();
    await cartOrWishlist.save();
}


const getListOfProducts = async function(req, opt, userId) {
    let products;
    let showUserNavMenu = req.session.showUserNavMenu;
    let menuData = await getCashedMenuData(getMenuData);
    let renderData = {
        showUserNavMenu,
        menuData,
        containerId: `${opt}-container`,
        btnClass: `remove-from-${opt}-btn`,
        route: `removeFrom${opt[0].toUpperCase()+opt.slice(1)}`
    };

    if (opt === 'cart') {
        products = await Cart.findOne({ user: userId }, { products: 1 }).lean();
    } else if (opt === 'wishlist') {
        products = await Wishlist.findOne({ user: userId }, { products: 1 }).lean();
    }
    renderData.productsData = products.products;
    return renderData;
}

const authenticateToken = async function(req, res, next) { // async ??
    let token = req.cookies['jwt'];
    if (token === null) {
        req.session.showUserNavMenu = false;
        return res.redirect('/');
    }
    jwt.verify(token, secretKey, (err) => {
        if (err) {
            req.session.showUserNavMenu = false;
            return res.redirect('/');
        }
        req.session.showUserNavMenu = true;
        next();
    });
};


const getListOfCartProducts = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');
    }

    let renderData = await getListOfProducts(req, 'cart', user._id);
    await mongoose.disconnect();
    res.render('cards-container.hbs', renderData);
};


const getListOfWishlistProducts = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');
    }
    let renderData = await getListOfProducts(req, 'wishlist', user._id);
    await mongoose.disconnect();
    res.render('cards-container.hbs', renderData);
};


const addProductToCart = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');
    }

    let result = await addProduct('cart', req.params["id"], user._id, req.params['quantity']);
    await mongoose.disconnect();
    return res.json({ message: result });
};


const addProductToWishlist = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');
    }
    let result = await addProduct('wishlist', req.params["id"], user._id, req.params['quantity']);
    await mongoose.disconnect();
    return res.json({ message: result });
};



const removeProductFromCart = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');;
    }
    await removeProduct('cart', req.params["id"], user._id);
    await mongoose.disconnect();
    return res.json({ 'remove': 'true', 'elementId': req.params["id"] })
};

const removeProductFromWishlist = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(req.cookies['refreshToken']);
    if (!user) {
        await mongoose.disconnect();
        req.session.showUserNavMenu=false;
        return res.redirect('/');;
    }
    await removeProduct('wishlist', req.params["id"], user._id);
    await mongoose.disconnect();
    return res.json({ 'remove': 'true', 'elementId': req.params["id"] })
};





module.exports = {
    getListOfCartProducts,
    getListOfWishlistProducts,
    addProductToCart,
    addProductToWishlist,
    removeProductFromCart,
    removeProductFromWishlist,
    authenticateToken,
};