import { switchBtns } from './switchBtnsFuncs.js';

import { getTargetCategoryName } from './switchBtnsFuncs.js';

import { setGetRequestes } from './requestToServer.js';

function setSalesBtns() {

    let salesBtns = document.getElementById('sales-btns');
    let salesCardsContainer = document.getElementById('sales-cards-container');
    let salesCards = Array.from(salesCardsContainer.querySelectorAll('article'));


    function switchSalesBtns(e) {
        switchBtns(e, salesBtns);
        let targetCategory = getTargetCategoryName(e);
        let targetCards = salesCards.filter((card) => card.classList.contains(targetCategory));

        targetCards.forEach((card) => card.classList.contains('show-element') ? null : card.classList.add('show-element'));

        targetCategory === 'all' ? null : salesCards.forEach((card) => {
            if (!card.classList.contains(targetCategory) && card.classList.contains('show-element')) {
                card.classList.remove('show-element');
            }
        });

    }
    salesBtns ? salesBtns.addEventListener('click', (e) => switchSalesBtns(e)) : null;

    setGetRequestes(salesCardsContainer);

}

setSalesBtns();

