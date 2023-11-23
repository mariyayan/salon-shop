export function setSlider(sliderId, carouselSlider, categoriesSlider) {

    let allSlides;
    let slideCount;
    let navBtns;
    let infiniteSlider;
    let sliderViewport;
    let navBtnsChildren;


    function createSliderVariables(sliderId) {

        let sliderVariables = sliderId.map(id => {
            let slider = categoriesSlider ? document.getElementById(id) : document.getElementById(id).querySelector('.slides-wrapper');
            let sliderWidth = slider.offsetWidth;
            let sliderViewportWidth = slider.closest('.slider').offsetWidth;
            let slides = slider.children;
            let slidesQuantity = slides.length;
            let slide = slides[0].offsetWidth;
            let slideWidth = carouselSlider ? slide + 80 : slide;
            let translateWidth = -slideWidth;
            let maxTranslateWidth = carouselSlider ? Math.ceil((slidesQuantity - (sliderViewportWidth / slideWidth)) * -slideWidth) : slidesQuantity * -slideWidth;

            return [slider, sliderWidth, slideWidth, translateWidth, maxTranslateWidth];
        });

        return sliderVariables;

    }

    let sliders = createSliderVariables(sliderId);
    let [slider, sliderWidth, slideWidth, translateWidth, maxTranslateWidth] = sliders[0];

    function createSliders(sliderId) {
        if (sliderId === 'main-slider' || sliderId === 'testimonials') {
            navBtns = document.getElementById(sliderId).querySelector('.nav-btns-slider');
            navBtns.addEventListener('click', (e) => switchNavBtns(e));
            sliderViewport = slider.closest('.slider');
            navBtnsChildren = Array.from(sliderViewport.querySelector('.nav-btns-slider').children);
            allSlides = document.getElementById(sliderId).querySelectorAll('.slider-text');
            slideCount = 1;
        }
        if (sliderId === 'mask') {
            let categoriesBtns = document.getElementById('categories-btns');
            categoriesBtns.addEventListener('click', function(e) {
                let activeSlider = document.getElementById('categories').querySelector('.category-active');
                let activeSliderVariables = getActiveSliderVariables(activeSlider);
                slider = activeSliderVariables[0];
                slider.style.transform = 'translateX(0px)';
                sliderWidth = activeSliderVariables[1];
                slideWidth = activeSliderVariables[2];
                translateWidth = activeSliderVariables[3];
                maxTranslateWidth = activeSliderVariables[4];
            })

        }

    }


    function getActiveSliderVariables(activeSlider) {
        let activeSliderVariables = sliders.find(slider => slider[0] === activeSlider);
        return activeSliderVariables;

    }


    function moveSlider() {
        if (translateWidth <= maxTranslateWidth || translateWidth > 0) {
            translateWidth = 0;
        }

        slider.style.transform = 'translateX(' + translateWidth + 'px)';
        translateWidth -= slideWidth;
        addActiveClass(sliderId[0]);
    }

    function left() {
        if (translateWidth >= -slideWidth || translateWidth >= 0) {
            return translateWidth = -slideWidth;
        }
        translateWidth += slideWidth * 2;
        slider.style.transform = 'translateX(' + translateWidth + 'px)';
        translateWidth -= slideWidth;
        if (sliderId[0] === 'main-slider' || sliderId[0] === 'testimonials') {
            slideCount -= 2;
            addActiveClass(sliderId[0]);
        }
    }




    function switchNavBtns(e) {
        if (e.target.classList.contains('slider-nav-btn')) {
            let targetNavBtnIndex = navBtnsChildren.indexOf(e.target);
            translateWidth = -slideWidth * targetNavBtnIndex;
            slider.style.transform = 'translateX(' + translateWidth + 'px)';
            translateWidth -= slideWidth;
            slideCount = targetNavBtnIndex;
            addActiveClass(sliderId);
        }
    }


    function addActiveClass(sliderId) {
        if (sliderId == 'testimonials' || sliderId == 'main-slider') {
            addClassName('nav-btn-active', navBtnsChildren);
            sliderId === 'main-slider' ? addClassName('text-active') : null;
            slideCount++;
        }
    }

    function addClassName(className, navBtns = false) {
        if (slideCount >= navBtnsChildren.length) {
            slideCount = 0;
        }
        sliderViewport.querySelector(`.${className}`).classList.remove(`${className}`);
        navBtns ? navBtnsChildren[slideCount].classList.add(`${className}`) : allSlides[slideCount].classList.add(`${className}`);
    }


    function setEventListenersForBtns() {
        let id = categoriesSlider ? 'categories' : sliderId[0];
        let leftBtn = document.getElementById(id).querySelector('.left-btn');
        let rightBtn = document.getElementById(id).querySelector('.right-btn');
        leftBtn.addEventListener('click', left);
        rightBtn.addEventListener('click', moveSlider);
    }


    setEventListenersForBtns();
    createSliders(sliderId[0]);

}