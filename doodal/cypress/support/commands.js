// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginToCognito = (username, password) => {
    // Extract the base URL from the provided URL
    const cognitoBaseUrl =
        "https://doodal.auth.us-west-2.amazoncognito.com/login";

    // Define the query parameters as a separate object
    const userCredentials = {
        username: username,
        password: password,
    };

    cy.origin(cognitoBaseUrl, { args: userCredentials }, ({username, password}) => {
        cy.contains("Sign in with your username and password");
        cy.get('input[name="username"]:visible').type(username);
        cy.get('input[name="password"]:visible').type(password, {
            log: false,
        });
        cy.get('input[name="signInSubmitButton"]:visible').click();
    });
};

// Integrate custom command into test
Cypress.Commands.add("loginByCognito", (username, password) => {
    return loginToCognito(username, password);
});
