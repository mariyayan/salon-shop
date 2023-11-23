import { showNestedBlock } from './nestedBlock.js';

import { turnArrow } from './turnArrow.js';

import { setAddToCartWishlistFullInfoRequests } from './requestToServer.js';



function setFullInfoInputArrows() {

    let productFullInfoCard = document.querySelector('.product-full-info');
    let productQuantity = document.getElementById('product-quantity');
    let productFullInfoCardInput = productFullInfoCard.querySelector('input');
    let productFullInfoCardInputMax = +productFullInfoCardInput.getAttribute('max');
    let productFullInfoCardInputMin = +productFullInfoCardInput.getAttribute('min');


    function chooseProductQuantity(e) {
        if (!e.target.classList.contains('fas')) return;
        let inputValue = +productFullInfoCardInput.value;
        if (e.target.classList.contains('fa-chevron-down')) {
            inputValue <= productFullInfoCardInputMin ? null : productFullInfoCardInput.value = inputValue - 1;
        } else if (e.target.classList.contains('fa-chevron-up')) {
            inputValue >= productFullInfoCardInputMax ? null : productFullInfoCardInput.value = inputValue + 1;
        }
    }
    productQuantity.addEventListener('click', (e) => chooseProductQuantity(e));
    productFullInfoCard.addEventListener('click', (e) => turnArrow(e))
    productFullInfoCard.addEventListener('click', (e) => showNestedBlock(e))
}

setFullInfoInputArrows();

setAddToCartWishlistFullInfoRequests();



