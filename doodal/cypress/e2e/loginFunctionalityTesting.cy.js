describe("Login and authentication flow", () => {
    it("navigates through login, logout, and re-login", () => {
        // 1. Navigate to the login page and login
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));

        // 2. Check for successful login indicators
        cy.url().should("eq", "http://localhost:3000/");
        cy.get(".profile").should("be.visible");
        cy.contains("Login").should("not.exist");

        // 3. Check for token in cookies
        const initialAuthCookie = cy
            .getCookie("authentication")
            .then((cookie) => {
                cy.log("Authentication Cookie Value:", cookie.value);
                expect(cookie.value).to.not.be.null;
            });
        cy.wait(1000);
        const initialUserInfoCookie = cy
            .getCookie("userInfo")
            .then((cookie) => {
                cy.log("User Info Cookie Value:", cookie.value);
                expect(cookie.value).to.not.be.null;
            });

        // 4. Checking log out functionality

        cy.get(".profile").click();
        cy.contains("Logout").click();
        cy.url().should("eq", "http://localhost:3000/");

        cy.getCookie("authentication").then((nullAuthCookie) => {
            cy.log("Authentication Cookie Value:", nullAuthCookie);
            expect(nullAuthCookie).to.be.null;
        });

        cy.getCookie("userInfo").then((nullUserInfoCookie) => {
            cy.log("User Info Cookie Value:", nullUserInfoCookie);
            expect(nullUserInfoCookie).to.be.null;
        });

        // 5. Log back in
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username2"), Cypress.env("password2"));
        cy.url().should("eq", "http://localhost:3000/");
        cy.get(".profile").should("be.visible");
        cy.contains("Login").should("not.exist");

        // 6. Re-Check for token in cookies and verify uniqueness
        cy.getCookie("authentication").then((newAuthCookie) => {
            expect(newAuthCookie.value).to.not.be.null;
            expect(newAuthCookie.value).to.not.equal(initialAuthCookie.value);
        });
        cy.wait(1000);
        cy.getCookie("userInfo").then((newUserInfoCookie) => {
            cy.log("User Info Cookie Value:", newUserInfoCookie.value);
            expect(newUserInfoCookie.value).to.not.be.null;
        });
    });
});

const loginToCognito = (username, password) => {
    // Extract the base URL from the provided URL
    const cognitoBaseUrl =
        "https://doodal.auth.us-west-2.amazoncognito.com/login";

    // Define the query parameters as a separate object
    const userCredentials = {
        username: username,
        password: password,
    };

    cy.origin(cognitoBaseUrl, { args: userCredentials }, () => {
        cy.contains("Sign in with your username and password");
        cy.get('input[name="username"]:visible').type("cypress-testing-1");
        cy.get('input[name="password"]:visible').type("Cypress-password-1", {
            log: false,
        });
        cy.get('input[name="signInSubmitButton"]:visible').click();
    });
};

// Integrate custom command into test
Cypress.Commands.add("loginByCognito", (username, password) => {
    return loginToCognito(username, password);
});
