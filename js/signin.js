// signInForm.js
import { cfg } from "./main.js"
import { renderMainPage } from "./mainPage.js";

function renderSignInForm() {
    $('#signin-form').on('submit', handleSignIn);
    window.location.hash = "#login";
}

function renderSignInFormWrongCredentials() {

}

async function handleSignIn(event) {
    event.preventDefault();
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();

    try { // sign in
        const response = await fetchSignIn(email, password);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('session-token', data.token);
            renderMainPage();
        } else {
            console.log('Sign-in failed after sign-up: ' + data.error);
            renderSignInFormWrongCredentials();
        }
    } catch (error) {
        console.log('An error occurred during sign-in after sign-up');
        renderSignInForm();
    }

}

async function fetchSignIn(email, password) {
    const signInData = {
        email: email,
        password: password
    };

    return await fetch(cfg.apiUrl + '/auth/sign-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signInData)
    });
}

export { renderSignInForm, handleSignIn, fetchSignIn };