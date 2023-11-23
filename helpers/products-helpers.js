let sortProductsBySubCategory = function(subCategoriesArr, products) {
    const result = {};
    subCategoriesArr.forEach((subCategory, index) => {
        let resultArr = products.filter(product => {
            return product.subCategory === subCategory || product[subCategory] === true
        })
        result[subCategory] = resultArr;
    })
    return result;
}

const getSubCategoriesArr = function(param) {
    return param === 'care' ? [
        [{ id: 'mask', class: 'category-active' }, { id: 'oil', class: '' }, { id: 'balm', class: '' }],
        ['mask', 'oil', 'balm']
    ] : [
        [{ id: 'ammoniac', class: 'category-active' }, { id: 'notammoniac', class: '' }, { id: 'colored', class: '' }],
        ['ammoniac', 'notammoniac', 'colored']
    ];
}


const getBtnInfo = function(subCategoriesArr, param) {
    let btnsInfo;
    if (param === 'sale') {
        btnsInfo = [{ id: 'all-products', name: 'all', class: 'nav-btn nav-btn-active' },
            { id: 'care-products', name: 'care', class: 'nav-btn' },
            { id: 'colors-products', name: 'colors', class: 'nav-btn' }
        ]
        console.log(btnsInfo)
    } else {

        btnsInfo = [{ id: `${subCategoriesArr[0]}-btn`, name: subCategoriesArr[0], class: 'nav-btn nav-btn-active' },
            { id: `${subCategoriesArr[1]}-btn`, name: subCategoriesArr[1], class: 'nav-btn' },
            { id: `${subCategoriesArr[2]}-btn`, name: subCategoriesArr[2], class: 'nav-btn' }
        ];
    }
    return btnsInfo;
}

module.exports = {
    sortProductsBySubCategory,
    getSubCategoriesArr,
    getBtnInfo,
};