import { setSlider } from './slider.js';

import { switchBtns } from './switchBtnsFuncs.js';

import { getTargetCategoryName } from './switchBtnsFuncs.js';

import { setGetRequestes } from './requestToServer.js';

function setCategories() {

    let categoriesSlidesWrapperIds = Array.from(document.querySelectorAll('#categories .slides-wrapper')).map(el => el.id);
    let categoriesCarousel = document.getElementById('categories-carousel');

    function setCategoriesBtns() {

        let categoriesBtns = document.getElementById('categories-btns');
        let categoriesContainer = document.getElementById('categories');

        function switchCategoriesBtns(e) {
            switchBtns(e, categoriesBtns);
            let targetCategory = getTargetCategoryName(e);
            categoriesContainer.querySelector('.category-active').classList.remove('category-active');
            let targetSlider = document.getElementById(targetCategory);
            targetSlider.classList.add('category-active');
        }


        categoriesBtns.addEventListener('click', (e) => switchCategoriesBtns(e));
        return categoriesContainer;
    }


    let categoriesContainer = setCategoriesBtns();
    setSlider(categoriesSlidesWrapperIds, true, true);
    setGetRequestes(categoriesCarousel);
    return categoriesContainer;
}

setCategories();


