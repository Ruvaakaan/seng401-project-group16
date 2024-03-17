describe('Homepage feed', () => {
  it('fetches and displays new and old competitions', () => {
    cy.visit('http://localhost:3000/'); // Replace with your actual homepage URL

    // Assert presence of new competitions
    cy.contains('Current Competitions');
    cy.get('.swiper-wrapper .swiper-slide') // Target all slides within the swiper wrapper
      .should('have.length.greaterThan', 1);

    // Assert new competition details (consider using data attributes or unique identifiers for clarity)
    cy.get('.swiper-wrapper .swiper-slide-active') // Target current competitions sliter
      .within(() => {
        cy.get('.card-img-flush').should('be.visible'); // Assert image visibility
        cy.get('.card-footer p').should('contain.text', 'ago'); 
      });
      // Assert details about old competitions
      cy.contains('Previous Competitions')
      cy.get('.old-prompts') 
      .should('have.length.greaterThan', 0)
  });
});
