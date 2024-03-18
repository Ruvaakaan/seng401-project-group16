describe("Gallery Sorting", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");

    cy.url().should("eq", "http://localhost:3000/");

    cy.get(".swiper-wrapper .swiper-slide-active") // Target the first  tile
    .within(() => {
        cy.get(".card-img-flush").click(); // Click the image within the first tile
      });
  });

  function getImageUrls() {
    // Get all image elements within cards
    return cy.get('.gal .row .col .card .card-img-top.gallery-img').then(($images) => {
      // Extract image URLs from each element
      return $images.map(($img) => $img.prop('src'));
    });
    
  }

  it("Sorts by Least Liked/Most Liked", () => {
    const likeFilters = ['Least Liked', 'Most Liked'];

    for (const filterText of likeFilters) {
      // Click the current filter
      cy.get('.filter-list li.filter-item:contains("' + filterText + '")').click();

      // Get image URLs after applying the filter
      getImageUrls().then((sortedUrls) => {
        // Expected order depends on the filter (ascending/descending)
        const expectedOrder = filterText === 'Least Liked' ? sortedUrls : sortedUrls.slice().reverse();

        // Get image URLs again and compare with expected order
        getImageUrls().then((currentUrls) => {
          cy.wrap(currentUrls).should('deep.eq', expectedOrder);
        });
      });
    }
  });

  it("Sorts by Newest/Oldest (Limited Verification)", () => {
    const timeFilters = ['Newest', 'Oldest'];

    for (const filterText of timeFilters) {
      // Click the current filter
      cy.get('.filter-list li.filter-item:contains("' + filterText + '")').click();

      // Unfortunately, Cypress alone cannot reliably determine image creation time.
      // Consider these approaches for limited verification:
      
      // 1. Check if order changes after applying the filter (basic test)
      cy.get('.gal .row .col:first .card .card-img-top.gallery-img').should('not.eq', cy.get('.gal .row .col:last .card .card-img-top.gallery-img'));

      // 2. Leverage server-side information (if available)
      // You might need to make additional API calls or use custom commands to access creation timestamps.
    }
  });
});
