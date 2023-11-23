import { setGetRequestes } from './requestToServer.js';

function setCartWishlistContainer() {

    let cartWishlistContainer = document.querySelector('.cart-wishlist');
    setGetRequestes(cartWishlistContainer);

}


setCartWishlistContainer();










