describe("Login", () => {
    it("logs in successfully using AWS Cognito", () => {
        // Visit the main website
        cy.visit("http://localhost:3000");

        // Click on the login button (adjust selector as needed)
        cy.contains("Login").click(); // Replace with your actual login button selector

        // Use custom command for authentication in Cognito iframe
        cy.loginByCognito("username", "password");

        // Verify successful login by waiting for the expected element
        cy.get(".get-started-element").should("be.visible"); // Replace with your element selector indicating login completion
    });
});

// cypress/support/auth-provider-commands/cognito.js
const loginToCognito = (username, password) => {
    // Cypress.log({
    //     displayName: "COGNITO LOGIN",
    //     message: [` Authenticating | ${username}`],
    //     autoEnd: false,
    // });

    // Extract the base URL from the provided URL
    const cognitoBaseUrl =
        "https://doodal.auth.us-west-2.amazoncognito.com/login";

    // Define the query parameters as a separate object
    const cognitoQueryParams = {
        client_id: "6c1og3jvcp62aqmkhjcgkjkvgq",
        response_type: "token",
        scope: "aws.cognito.signin.user.admin+email+openid+phone+profile",
        redirect_uri: "http://localhost:3000/", // Assuming the redirect URI is simply the root path
    };

    cy.origin(cognitoBaseUrl, { args: cognitoQueryParams }, () => {
      cy.contains('Sign in with your username and password')
      cy.get('input[name="username"]:visible').type('cypress-testing-1')
      cy.get('input[name="password"]:visible').type('Cypress-password-1', {
        // use log: false to prevent your password from showing in the Command Log
        log: false,
      })
      cy.get('input[name="signInSubmitButton"]:visible').click()
    });
    
    
    
    

    // Wait for successful login and redirect (adjust timeout as needed)
    cy.wait(2000);
};

// Integrate custom command into test
Cypress.Commands.add("loginByCognito", (username, password) => {
    return loginToCognito(username, password);
});
