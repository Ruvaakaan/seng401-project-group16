describe("Drawing and fetching functionalities", () => {
    it("allows drawing, submitting, fetching, and profile verification", () => {
        // 1. Navigate to the login page and login
        cy.viewport(1500, 1000)
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
        cy.url().should("eq", "http://localhost:3000/");

        //1.5 Navigate to profile page to find how many picture submissions already exist for user
        cy.get(".custom-dropdown").click();
        cy.contains("Profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");

        cy.get(".image-gallery img").should("not.exist");

        cy.contains("Home").click();

        //2. Click on the latest competition
        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
            .within(() => {
                cy.get(".card-img-flush").click(); // Click the image within the first tile
            });
        cy.url().should("contain", "/gallery");

        cy.contains(Cypress.env("username1")).should("not.exist");

        //3. Click on the draw button to enter the competition
        cy.get(".entry-button").click();

        //4. Draw an image on the drawing page


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

        //5.  Submit the drawing (replace with appropriate selector or action)
        cy.contains("Upload").click();

        //6. Checking redirect from submission button and that new photo does exist
        cy.url().should("contain", "/gallery");
        cy.contains("Draw").should("not.exist");
        cy.contains("Newest").click();

        cy.contains(Cypress.env("username1"));

        //7. Navigating to profile to see if another picture exists

        cy.get(".custom-dropdown").click();
        cy.contains("Profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");

        cy.get(".image-gallery img");

        //cleaning up
        cy.get(".card-body i").click();
        cy.contains('Delete!').click()

        cy.wait(1000);
        cy.get(".image-gallery img").should("not.exist");

    });
});
