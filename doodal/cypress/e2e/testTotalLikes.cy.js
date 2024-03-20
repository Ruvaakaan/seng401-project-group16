describe('Testing Total Likes functionality', () => {
  it('passes', () => {
    cy.viewport(1500, 1000)
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
    cy.url().should("eq", "http://localhost:3000/");

    cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
      .within(() => {
        cy.get(".card-img-flush").click(); // Click the image within the first tile
      });
    cy.url().should("contain", "/gallery");

    cy.get(".entry-button").click();

    function drawCurrentTimeTally() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading zero
      let initialY = 500;
      const initialX = 700;

      for (let i = 0; i < hours; i++) {
        let xCoord = initialX + i * 15;
        cy.get('canvas[width="742"][height="659"]')
          .trigger("mousedown", {
            clientX: xCoord,
            clientY: initialY,
          }) // Simulate click at (500, 500)
          .trigger("mousemove", {
            clientX: xCoord,
            clientY: initialY,
          }) // Move mouse to (600, 600)
          .trigger("mousemove", {
            clientX: xCoord,
            clientY: initialY + 50,
          }) // Move mouse to (600, 600)
          .trigger("mouseup", {
            clientX: xCoord,
            clientY: initialY + 50,
          }); // Release mouse button at (600, 600)
      }

      initialY = 400;

      for (let i = 0; i < minutes / 4; i++) {
        let xCoord = initialX + i * 15;
        cy.get('canvas[width="742"][height="659"]')
          .trigger("mousedown", {
            clientX: xCoord,
            clientY: initialY,
          }) // Simulate click at (500, 500)
          .trigger("mousemove", {
            clientX: xCoord,
            clientY: initialY,
          }) // Move mouse to (600, 600)
          .trigger("mousemove", {
            clientX: xCoord,
            clientY: initialY + 50,
          }) // Move mouse to (600, 600)
          .trigger("mouseup", {
            clientX: xCoord,
            clientY: initialY + 50,
          }); // Release mouse button at (600, 600)
      }
    }
    //Draw the current time as a collection of tallys. Only for differentiation purposes
    drawCurrentTimeTally();

    cy.contains("Upload").click();
    cy.wait(3000);
    cy.get(".custom-dropdown").click();
    cy.contains("Profile").click();
    cy.url().should("eq", "http://localhost:3000/profile");

    cy.get(".account-info .likes h2").contains('0');
    cy.get(".image-gallery img").click();
    cy.get('.popup-likes button.like').click();
    cy.wait(1000)
    cy.get(".btn-close").click();
    cy.reload()

    cy.get(".account-info .likes h2").contains('1');

    cy.get(".image-gallery img").click();
    cy.get('.popup-likes button.like').click();
    cy.wait(1000)
    cy.get(".btn-close").click();
    cy.reload()

    cy.get(".account-info .likes h2").contains('0');
    cy.get(".card-body i").click();
    cy.contains('Delete!').click()

    cy.wait(1000);
    cy.get(".image-gallery img").should("not.exist");
  })
})