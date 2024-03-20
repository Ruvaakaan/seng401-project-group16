describe('Testing Changing Bio', () => {
  it('Logs in, changes bio, refreshes, checks that bio is changed', () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
    cy.url().should("eq", "http://localhost:3000/");


    cy.get(".custom-dropdown").click();
    cy.contains("Profile").click();
    cy.url().should("eq", "http://localhost:3000/profile");

    cy.contains('Update Bio').click();

    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const newBio = `Brand New Bio - ${currentTime}`;

    cy.get('input[type="text"]').type(newBio);
    cy.get('.settings-content button').click();

    cy.contains(newBio);

    cy.reload();

    cy.contains(newBio);
  })
})