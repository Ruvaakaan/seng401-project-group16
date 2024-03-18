describe("template spec", () => {
    it("passes", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
        cy.url().should("eq", "http://localhost:3000/");

        cy.get(".old-prompts").within(() => {
            cy.get("img").click()
        });

        cy.url().should("contain", "/gallery")

        //incomplete, must check for other images on the screen

        
      });
});
