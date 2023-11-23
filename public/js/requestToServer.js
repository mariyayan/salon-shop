
function setMakeRequestFunction() {

    let messageWindow = document.getElementById('message-window');
    let messageWindowTextBlock = messageWindow.querySelector('p');
    let loginErrorField = document.getElementById('login-error');
    let passwordErrorField = document.getElementById('password-error');
    let userMenuOptions = document.querySelectorAll('.user-menu-option');
    let authUserMenuOptions = document.querySelectorAll('.auth-user-menu-option');

    function validateFormData(e, reArr) {

        e.preventDefault();
        let form = e.target.closest('form');
        let inputs = form.querySelectorAll('input');

        let showedErrors = form.querySelectorAll('.show-element');
        let validationResult = true;
        showedErrors.length > 0 ? showedErrors.forEach(item => item.classList.remove('show-element')) : null;

        inputs.forEach((inputElement, index) => {
            if (!reArr[index].test(inputElement.value)) {
                inputElement.closest('div').querySelector('.form-errors > p:nth-of-type(1)').classList.add('show-element'); //лучше это наверное как то переписать 
                validationResult = false;
            }
        })
        return [validationResult, inputs];
    }



    function getFormData(dataArgsArray) {

        let [e, re] = dataArgsArray;
        let resultOfValidation = validateFormData(e, re);
        return resultOfValidation[0] ? [resultOfValidation[1]] : false;

    }



    function convertFormDataToJSON(data) {
        let jsonObj = {};
        data[0].forEach(item => {
            jsonObj[item.name] = item.value
        })

        return JSON.stringify(jsonObj);
    }


    function sendPOSTData(data, path) {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: convertFormDataToJSON(data)
        })
    }


    function sendGETData(path) {
        return fetch(path);
    }


    async function processServerResponce(responce) {

        let responceJSON = await responce.json();

        if (responceJSON.form) {
            return showServerFormError(responceJSON.form, responceJSON.errorType);
        }
        if (responceJSON.message) {
            return showMessage(responceJSON.message);
        }

        if (responceJSON.remove) {
            return removeElement(responceJSON.elementId);
        }

        if (responceJSON.navmenu) {
            return showUserNavMenu();
        }

        if (!responceJSON.navmenu) {
            return hideUserNavMenu();
        }

    }




    function showMessage(messageText) {
        messageWindowTextBlock.textContent = messageText;
        messageWindow.classList.add('show-element');
        setTimeout(() => messageWindow.classList.remove('show-element'), 3000);
    }


    function removeElement(elementId) {
        document.getElementById(elementId).remove();
    }


    function showServerFormError(text, errorType) {
        if (errorType === 'login') {
            loginErrorField.textContent = text;
            loginErrorField.classList.add('show-element');
        } else if (errorType === 'password') {
            passwordErrorField.textContent = text;
            passwordErrorField.classList.add('show-element');
        }
    }


    function showUserNavMenu() {
        userMenuOptions.forEach(option => option.classList.remove('show-option'));
        authUserMenuOptions.forEach(option => option.classList.add('show-option'));
    }

    function hideUserNavMenu() {
        authUserMenuOptions.forEach(option => option.classList.remove('show-option'));
        userMenuOptions.forEach(option => option.classList.add('show-option'));
    }



    async function makeRequestToServer(dataArgsArray, requestArgsArray) {

        let inputs = getFormData(dataArgsArray);
        if (!inputs) {
            return;
        }

        sendPOSTData(inputs, ...requestArgsArray).then(serverResponce => processServerResponce(serverResponce))
    }



    function setSearchRequest() {

        let searchProductFormRE = [/\w{1,}/];
        let searchBtn = document.getElementById('search-btn');

        searchBtn.addEventListener('mousedown', function(e) {
            let validationResult = validateFormData(e, searchProductFormRE);
            validationResult[0] ? e.currentTarget.setAttribute('href', `/search/${validationResult[1][0].value}`) : e.preventDefault();
        })
    }


    function setGetRequestes(container) {


        container.addEventListener('click', (e) => processGetRequest(e));

        function getPath(e) {
            let btn = e.target.closest('.clickable');
            if (!btn) return;
            let path = btn.getAttribute('id');
            return path;
        }

        async function processGetRequest(e) {
            let path = getPath(e);
            if (!path) return;
            sendGETData(path).then(serverResponce => processServerResponce(serverResponce));
        }
    }


    function setAddToCartWishlistFullInfoRequests() {

        let productFullInfoCard = document.querySelector('.product-full-info');
        let addToCartBtn = productFullInfoCard.querySelector('.add-to-cart-btn')
        let addToWishlistBtn = productFullInfoCard.querySelector('.add-to-wishlist-btn')
        addToCartBtn.addEventListener('click', (e) => setPath(e));
        addToWishlistBtn.addEventListener('click', (e) => setPath(e));


        async function setPath(e) {

            let btn = e.currentTarget;
            let path;
            let productId = productFullInfoCard.getAttribute('id')
            let quantity = productFullInfoCard.querySelector('input').value;

            if (btn.classList.contains('add-to-cart-btn')) {
                path = `/addToCart/${productId}/${quantity}`;
            } else if (btn.classList.contains('add-to-wishlist-btn')) {
                path = `/addToWishlist/${productId}/${quantity}`;
            }
            sendGETData(path).then(serverResponce => processServerResponce(serverResponce));
        }

    }

    return [makeRequestToServer, setSearchRequest, setAddToCartWishlistFullInfoRequests, setGetRequestes];

}

export let [makeRequestToServer, setSearchRequest, setAddToCartWishlistFullInfoRequests, setGetRequestes] = setMakeRequestFunction();