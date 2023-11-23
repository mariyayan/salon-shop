import { makeRequestToServer, setSearchRequest } from './requestToServer.js';

import { showNestedBlock } from './nestedBlock.js';

import { turnArrow } from './turnArrow.js';

function setMenu() {
    let userNavMenu = document.getElementById('user-nav-menu');
    let productNavMenu = document.getElementById('product-nav-menu');

    userNavMenu.addEventListener('click', (e) => showNestedBlock(e));
    productNavMenu.addEventListener('click', (e) => showNestedBlock(e));

    productNavMenu.addEventListener('click', (e) => turnArrow(e));
}


setMenu();



// SHOW BURGER MENU

function setBurgerMenu() {

    let burger = document.getElementById('burger');
    let menuWrapper = document.getElementById('product-nav-menu-wrapper');
    let menu = document.getElementById('product-nav-menu');
    let menuCross = menuWrapper.querySelector('.cross');
    let closeWindowByCrossClick = setCloseWindowByCrossClick();

    function openBurgerMenu() {
        menu.classList.add('open-menu');
        menuWrapper.classList.add('window');
        menuWrapper.classList.add('show-window');
        menuCross.classList.add('show-window');

    }

    function closeBurgerMenu() {
        menuWrapper.classList.remove('window');
        menuCross.classList.remove('show-window');
        menu.classList.remove('open-menu');
        menu.classList.remove('show-element');
    }

    burger.addEventListener('click', openBurgerMenu)
    menuCross.addEventListener('click', () => closeWindowByCrossClick(menuWrapper, closeBurgerMenu))


}

setBurgerMenu();




// CROSS

function setCloseWindowByCrossClick() {


    let form = document.getElementById('registration-authentication-form');
    let formCross = form.querySelector('.cross');

    function closeWindowByCrossClick(container, func) {
        container.classList.remove('show-window');
        container.querySelectorAll('input').forEach(input => input.value = '');
        func ? func() : null;
    }
    formCross.addEventListener('click', () => closeWindowByCrossClick(form));

    return closeWindowByCrossClick;
}








function setForms() {

    let registrationAuthenticationFormRE = [/\w{3,10}/, /\w{5,15}/];


    function setFormWindow(opt) {
        let data;
        if (opt === 'registration') {
            data = ['Registration', 'send-registration-form-btn'];
        } else if (opt === 'authentication') {
            data = ['Authentication', 'send-authentication-form-btn'];
        }
        let form = document.getElementById('registration-authentication-form');
        let h1 = form.querySelector('h1');
        h1.textContent = data[0];
        let button = form.querySelector('button');
        button.setAttribute('id', data[1]);

        form.classList.add('show-window');

        return button;
    }


    let registrationBtn = document.getElementById('registration-btn');
    let authenticationBtn = document.getElementById('authentication-btn');


    registrationBtn.addEventListener('click', function(e) {
        let sendFormBtn = setFormWindow('registration');


        sendFormBtn.addEventListener('click', (e) => makeRequestToServer([e, registrationAuthenticationFormRE], ['/registration', 'post']));
    })


    authenticationBtn.addEventListener('click', function(e) {
        let sendFormBtn = setFormWindow('authentication');

        sendFormBtn.addEventListener('click', (e) => makeRequestToServer([e, registrationAuthenticationFormRE], ['/authentication', 'post']));
    })


    setSearchRequest();

}


setForms()
