// mainPage.js

import { renderProducts } from "./products.js";

function renderMainPage() {
    $('#navbar').show();
    $('#open-products-page-btn').on('click', renderProducts);
    window.location.hash = '#index';
}

export { renderMainPage };