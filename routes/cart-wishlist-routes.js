const express = require('express');
const router = express.Router();
const {
    getListOfCartProducts,
    getListOfWishlistProducts,
    addProductToCart,
    addProductToWishlist,
    removeProductFromCart,
    removeProductFromWishlist,
    authenticateToken,
} = require('../controllers/cart-wishlist-controller');
const { refreshToken } = require('../controllers/reg-auth-logout-controller');

router.get('/cart', authenticateToken, refreshToken, getListOfCartProducts);
router.get('/wishlist', authenticateToken, refreshToken, getListOfWishlistProducts);
router.get('/addToCart/:id/:quantity?', authenticateToken, refreshToken, addProductToCart);
router.get('/addToWishlist/:id/:quantity?', authenticateToken, refreshToken, addProductToWishlist);
router.get('/removeFromCart/:id', authenticateToken, refreshToken, removeProductFromCart);
router.get('/removeFromWishlist/:id', authenticateToken, refreshToken, removeProductFromWishlist);

module.exports = router;