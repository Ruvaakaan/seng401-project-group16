describe("Login and authentication flow", () => {
    it("navigates through login and logout", () => {
        // 1. Navigate to the login page and login
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));

        // 2. Check for successful login indicators
        cy.url().should("eq", "http://localhost:3000/");
        cy.get(".custom-dropdown").should("be.visible");
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

        cy.get(".custom-dropdown").click();
        cy.contains("Logout").click();
        cy.url().should("eq", "http://localhost:3000/home");
        
        // 5. Chcking that cookies are null afterwards
        cy.getCookie("authentication").then((nullAuthCookie) => {
            cy.log("Authentication Cookie Value:", nullAuthCookie);
            expect(nullAuthCookie).to.be.null;
        });

        cy.getCookie("userInfo").then((nullUserInfoCookie) => {
            cy.log("User Info Cookie Value:", nullUserInfoCookie);
            expect(nullUserInfoCookie).to.be.null;
        });          
    });
});

