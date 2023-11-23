import { setSlider } from './slider.js';

import { setGetRequestes } from './requestToServer.js';


function setIndexPageFunctions() {

    setSlider(['main-slider'], false, false);
    setSlider(['testimonials'], false, false);
    setSlider(['popular-carousel'], true, false);

    let popularCarousel = document.getElementById('popular-carousel');
    setGetRequestes(popularCarousel);

}

setIndexPageFunctions();