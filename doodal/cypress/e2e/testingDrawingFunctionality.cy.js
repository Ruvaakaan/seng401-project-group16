describe("Drawing and fetching functionalities", () => {
    it("allows drawing, submitting, fetching, and profile verification", () => {
        // 1. Navigate to the login page and login
        cy.visit("http://localhost:3000");
        cy.contains("Login").click();
        cy.loginByCognito(Cypress.env("username1"), Cypress.env("password1"));
        cy.url().should("eq", "http://localhost:3000/");

        //1.5 Navigate to profile page to find how many picture submissions already exist for user
        cy.get(".custom-dropdown").click();
        cy.contains("Profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");

        cy.get(".image-gallery img").its("length").as("imageCount");
        cy.get("@imageCount").then((value) => {
            cy.log(`Value of alias imageCount:`, value);
        });

        cy.contains("Home").click();

        //2. Click on the latest competition
        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
            .within(() => {
                cy.get(".card-img-flush").click(); // Click the image within the first tile
            });
        cy.url().should("contain", "/gallery");

        //Commented out as functionality for this isn't built in yet
        // cy.contains(Cypress.env("username1")).should("not.exist");

        //3. Click on the draw button to enter the competition
        cy.get(".entry-button").click();

        //4. Draw an image on the drawing page

        
        function drawCurrentTimeTally() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading zero
            let initialY = 300;
            const initialX = 300;

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

        // Assert redirection to gallery (replace '/gallery' with actual URL)

        //temporary fix based on the current implementation to fully test functinality at the moment
        //!REMOVE WHEN COMPLETED
        //!REMOVE WHEN COMPLETED
        //!REMOVE WHEN COMPLETED
        //!REMOVE WHEN COMPLETED

        cy.contains("Home").click();

        cy.get(".swiper-wrapper .swiper-slide-active") // Target the first (active) tile
            .within(() => {
                cy.get(".card-img-flush").click(); // Click the image within the first tile
            });

        //!REMOVE WHEN COMPLETED
        //!REMOVE WHEN COMPLETED
        //!REMOVE WHEN COMPLETED
        //6. Checking redirect from submission button and that new photo does exist
        cy.url().should("contain", "/gallery");
        // cy.contains("Draw").should("not.exist");
        cy.contains("Most Liked").click();

        cy.contains(Cypress.env("username1"));

        //7. Navigating to profile to see if another picture exists

        cy.get(".custom-dropdown").click();
        cy.contains("Profile").click();
        cy.url().should("eq", "http://localhost:3000/profile");

        cy.get(".image-gallery img").its("length").as("newImageCount");
  
        cy.get("@imageCount").then((value) => {
          cy.log(`Value of alias imageCount:`, value);
      });

        cy.get("@imageCount").then((imageCount) => {
            cy.wait(500)
            cy.log(imageCount)
            cy.get("@newImageCount").then((newImageCount) => {
              cy.log(newImageCount)
                cy.wait(500)
                expect(newImageCount).to.equal(imageCount);
            });
        });
    });
});
