// main.js
import { renderSignInForm } from "./signin.js";
import { renderMainPage } from "./mainPage.js";

var cfg = {
    apiUrl: "",
    apiKey: "",
    maxRequests: 10,
    retryDelay: 10
};

(function () {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            cfg.apiUrl = data.apiUrl;
            cfg.apiKey = data.apiKey;
            cfg.maxRequests = data.maxRequests;
            cfg.retryDelay = data.retryDelay;
        })
        .catch(error => {
            console.error('Error loading configuration:', error);
        });
})();

window.onload = async () => {
    checkSessionAndRedirect();
    $('#loading-indicator').remove();
}

function checkSessionAndRedirect() {
    if (localStorage.getItem("session-token") == null) {
        renderSignInForm();
    } else {
        renderMainPage();
    }
}

export { cfg };