describe('template spec', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000/viewaccount/cypress-testing-2");

    cy.get(".username").contains('cypress-testing-2');
    cy.get(".likes").contains("@cypress-testing-2 ‧ Total Likes: ");
    cy.get(".bio").contains("A Very Unique Bio Specific to this User");
    cy.get(".image-gallery img");
  })
})