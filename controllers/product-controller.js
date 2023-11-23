const Product = require('../models/Product');
const {
    sortProductsBySubCategory,
    getSubCategoriesArr,
    getBtnInfo
} = require('../helpers/products-helpers');
const mongoose = require('mongoose');

async function getMenuData() {

    let products = await Product.find().lean();
    let sortedProducts = sortProductsBySubCategory(['mask', 'oil', 'balm', 'ammoniac', 'ammoniacFree', 'colored', 'popular'], products);
    return sortedProducts;
}

function cacheData(getMenuData) {
    var cache = {};
    return async function() {
        if (!(getMenuData in cache)) {
            cache[getMenuData] = await getMenuData();
        }
        return cache[getMenuData];
    }
}

let getCashedMenuData = cacheData(getMenuData);

const getMainPage = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let sortedProducts = await getCashedMenuData(getMenuData);
    await mongoose.disconnect();
    res.render('index.hbs', {
        showUserNavMenu,
        switchBtns: false,
        carouselId: 'popular-carousel',
        subCategoriesArr: false,
        productsData: sortedProducts,
    })
};

const getProduct = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let menuData = await getCashedMenuData(getMenuData);
    let product = await Product.findById(req.params["id"]).lean();
    await mongoose.disconnect();
    if (!product) {
        return;
    }
    res.render('product.hbs', {
        showUserNavMenu,
        product,
        productsData: menuData,
    })
};

const searchProduct = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let menuData = await getCashedMenuData(getMenuData);
    let products = await Product.findProducts(req.params['product']).lean();
    await mongoose.disconnect();
    res.render('product-cards-container.hbs', {
        products,
        salesContainer: false,
        switchBtns: false,
        containerId: 'search-results-container',

        productsData: menuData,
        showUserNavMenu
    })
};


const getProductsByCategories = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let menuData = await getCashedMenuData(getMenuData);
    let products = await Product.find({ category: req.params['categoryName'] }).lean();
    await mongoose.disconnect();
    let [subCategoriesArr, subCategoriesDataArr] = getSubCategoriesArr(req.params['categoryName']);
    let btnsInfo = getBtnInfo(subCategoriesDataArr);
    let sortedProducts = sortProductsBySubCategory(subCategoriesDataArr, products);
    res.render('carousel-container.hbs', {
        showUserNavMenu,
        menuData,
        productsData: sortedProducts,
        subCategoriesArr,
        carouselId: 'categories-carousel',
        switchBtnsInfo: {
            id: 'categories-btns',
            btnInfo: btnsInfo
        }
    })
};


const getSaleProducts = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let menuData = await getCashedMenuData(getMenuData);
    let products = await Product.find({ sale: true }).lean();
    await mongoose.disconnect();
    let btnsInfo = getBtnInfo(null, 'sale');
    res.render('product-cards-container.hbs', {
        products,
        switchBtnsInfo: {
            id: 'sales-btns',
            btnInfo: btnsInfo
        },
        productsData: menuData,
        showUserNavMenu,
    })
};


module.exports = {
    getMainPage,
    getProduct,
    searchProduct,
    getProductsByCategories,
    getSaleProducts,
    getMenuData,
    getCashedMenuData
};