describe("Testing Commenting", () => {
    it("Logs in, goes to first competition, first image, comments time, refreshes and checks", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
        cy.url().should("eq", "http://localhost:3000/");

        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
            .within(() => {
                cy.get(".card-img-flush").click(); // Click the image within the first tile
            });
        cy.url().should("contain", "/gallery");

        cy.get(".gal .row .col .card .card-img-top.gallery-img")
            .first()
            .click();

        const now = new Date();
        const currentTime = `${now.getHours()}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

        // Find the comment input and type the current time
        cy.get('.post-comment-form input[id="newComment"]').type(currentTime);

        // Click the "Post" button (assuming it's enabled after typing a comment)
        cy.get(".post-comment-form button").click(); // Might need adjustment based on button behavior

        // Close the modal (assuming a close button exists)
        cy.get(".btn-close").click(); // Adjust selector if needed

        // Refresh the page
        cy.reload();

        // Navigate back to the first image in the gallery (assuming same behavior)
        cy.get(".gal .row .col .card .card-img-top.gallery-img")
            .first()
            .click();

        // Verify the comment exists (adjust selector if needed)
        cy.get(".comments-section .toast-body")
            .contains(currentTime)
            .should("exist");

            cy.get(".btn-close").click(); // Adjust selector if needed


        cy.get(".custom-dropdown").click();
        cy.contains("Logout").click();
        cy.url().should("eq", "http://localhost:3000/home");

        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
            .within(() => {
                cy.get(".card-img-flush").click(); // Click the image within the first tile
            });
        cy.url().should("contain", "/gallery");

        cy.get(".gal .row .col .card .card-img-top.gallery-img")
            .first()
            .click();
        cy.get(".comments-section .toast-body")
            .contains(currentTime)
            .should("exist");
    });
});
