describe('Testing Commenting Functionality', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
    cy.url().should("eq", "http://localhost:3000/");

    cy.get(".swiper-wrapper .swiper-slide-active") // Target the first  tile
      .within(() => {
        cy.get(".card-img-flush").click(); // Click the image within the first tile
      });

    cy.url().should("contain", "/gallery");


    cy.get('.filter-list li.filter-item:contains("Newest")').click();
    cy.wait(1000)
    // Target the first card's like button and counter
    cy.get('.gal .row .col:first .card .like-container .like').as('likeButton');
    cy.get('.gal .row .col:first .card .like-counter').as('likeCounter');

    // Get the initial like count before interacting
    cy.get('@likeCounter').invoke('text').then(($initialCount) => {
      const initialCount = parseInt($initialCount);

      // Click the like button
      cy.get('@likeButton').click();
      cy.reload()
      // Verify like count increases by 1

      cy.get('.filter-list li.filter-item:contains("Newest")').click();
      cy.wait(1000)
      
      cy.get('@likeCounter').invoke('text').should('eq', String(initialCount + 1));
      // Click the like button again (unlike)
      cy.get('@likeButton').click();
      cy.reload()

      cy.get('.filter-list li.filter-item:contains("Newest")').click();
      cy.wait(1000)
      
      // Verify like count returns to initial value
      cy.get('@likeCounter').invoke('text').should('eq', $initialCount);

    });
  })
})