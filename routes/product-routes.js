const express = require('express');
const router = express.Router();
const {
    getMainPage,
    getProduct,
    searchProduct,
    getProductsByCategories,
    getSaleProducts
} = require('../controllers/product-controller');

router.get('/', getMainPage);
router.get('/product/:id', getProduct);
router.get('/search/:product', searchProduct);
router.get('/category/:categoryName', getProductsByCategories);
router.get('/sale', getSaleProducts);

module.exports = router;