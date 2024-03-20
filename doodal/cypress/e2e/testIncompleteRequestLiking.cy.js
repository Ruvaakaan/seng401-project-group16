describe('Testing Commenting Functionality', () => {
  it('passes', () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
    cy.url().should("eq", "http://localhost:3000/");

    cy.get(".swiper-wrapper .swiper-slide-active") // Target the first tile
      .within(() => {
        cy.get(".card-img-flush").click(); // Click the image within the first tile
      });

    cy.url().should("contain", "/gallery");

    // Like Functionality (with reload and verification)
    cy.get('.filter-list li.filter-item:contains("Newest")').click();
    cy.wait(1000)

    cy.get('.gal .row .col').first().click()
    // Click the card's image to open the popup

    // Find like count in popup and store it
    cy.get('.popup-likes-num').invoke('text')
      .then(($likeCountText) => {
        const initialLikeCount = parseInt($likeCountText);

        cy.setCookie('authentication', 'invalidAuthToken');

        // Like action
        cy.get('.popup-likes button.like').click(); // Click the like button in the popup

        cy.origin("https://doodal.auth.us-west-2.amazoncognito.com/login", {}, () => {
          cy.wait(200)
          cy.get('.btn-primary.submitButton-customizable').should('be.visible').click({ multiple: true, force: true });
        });

        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first  tile
          .within(() => {
            cy.get(".card-img-flush").click(); // Click the image within the first tile
          });
        cy.url().should("contain", "/gallery");

        cy.get(".gal .row .col .card .card-img-top.gallery-img")
          .first()
          .click();

        // Verify like count in popup after like action
        cy.get('.popup-likes-num').invoke('text')
          .then(($newLikeCountText) => {
            const newLikeCount = parseInt($newLikeCountText);
            cy.wrap(newLikeCount).should('eq', initialLikeCount + 1); // Verify like count is incremented by 1
          });

        cy.setCookie('authentication', 'invalidAuthToken');

        cy.get('.popup-likes button.like').click();
        cy.wait(1000);

        cy.origin("https://doodal.auth.us-west-2.amazoncognito.com/login", {}, () => {
          cy.wait(200)
          cy.get('.btn-primary.submitButton-customizable').should('be.visible').click({ multiple: true, force: true });
        });

        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first  tile
          .within(() => {
            cy.get(".card-img-flush").click(); // Click the image within the first tile
          });
        cy.url().should("contain", "/gallery");

        cy.get('.filter-list li.filter-item:contains("Newest")').click();
        cy.wait(1000)
        cy.get(".gal .row .col .card .card-img-top.gallery-img")
          .first()
          .click();


        cy.get('.popup-likes-num').invoke('text')
          .then(($newLikeCountText) => {
            const newLikeCount = parseInt($newLikeCountText);
            cy.wrap(newLikeCount).should('eq', initialLikeCount); // Verify like count is incremented by 1
          });
      });
  });
});
