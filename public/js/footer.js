import { showNestedBlock } from './nestedBlock.js';

import { turnArrow } from './turnArrow.js';


function setFooter() {
    let footer = document.querySelector('footer');
    footer.addEventListener('click', (e) => turnArrow(e));
    footer.addEventListener('click', (e) => showNestedBlock(e));
}

setFooter();