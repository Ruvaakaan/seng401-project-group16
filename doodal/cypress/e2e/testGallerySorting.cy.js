describe("Gallery Sorting", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");

        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(2000)

        cy.contains("Gallery").click()
    });
    
    it("Sorts by Least Liked", () => {
        cy.get('.filter-list li.filter-item:contains("Least Liked")').click();
        //Delay to account for time taken to sort photos
        cy.wait(2000)
        cy.get(".gal .row .col .card").each(($card, index) => {
          // Click the card to open the popup
          cy.wrap($card).click();
      
          // Extract the like count from the popup
          cy.get(".popup-likes-num")
            .invoke("text")
            .then((likeCountText) => {
              const currentCount = parseInt(likeCountText);
      
              if (index > 0) {
                // Access the previously extracted count from the 'cy' object
                cy.get('@previousCount').then((previousCount) => {
                  cy.wrap(currentCount).should("be.gte", previousCount);
                });
              }
      
              // Store the current count for comparison with the next card
              cy.wrap(currentCount).as('previousCount');
            });
      
          // Close the popup
          cy.get(".btn-close").click();
        });
      });

    it("Sorts by Most Liked", () => {
        cy.get('.filter-list li.filter-item:contains("Most Liked")').click();
      
        cy.get(".gal .row .col .card").each(($card, index) => {
          // Click the card to open the popup
          cy.wrap($card).click();
      
          // Extract the like count from the popup
          cy.get(".popup-likes-num")
            .invoke("text")
            .then((likeCountText) => {
              const currentCount = parseInt(likeCountText);
      
              if (index > 0) {
                // Access the previously extracted count from the 'cy' object
                cy.get('@previousCount').then((previousCount) => {
                  cy.wrap(currentCount).should("be.lte", previousCount);
                });
              }
              cy.wrap(currentCount).as('previousCount');
            });
      
          cy.get(".btn-close").click();
        });
      });

    function convertToSeconds(timeString) {
        const timeParts = timeString.split(" ");
        const value = parseInt(timeParts[1]);
        const unit = timeParts[2].toLowerCase();

        switch (unit) {
            case "second":
                return value;
            case "seconds":
                return value;
            case "minute":
                return value * 60;
            case "minutes":
                return value * 60;
            case "hour":
                return value * 60 * 60;
            case "hours":
                return value * 60 * 60;
            case "days":
                return value * 60 * 60 * 24;
            case "day":
                return value * 60 * 60 * 24;
            default:
                throw new Error(`Unsupported time unit: ${unit}`);
        }
    }

    it("Sorts by Newest", () => {
        const convertedTimes = [];

        cy.get('.filter-list li.filter-item:contains("Newest")').click();
        cy.wait(1000);
        cy.get(".gal .row .col .card").each(($card, index) => {
            // Click each card to open the popup
            cy.wrap($card).click();

            // Extract posted time from the popup
            cy.get(".posted-time")
                .invoke("text")
                .then(($postedTime) => {
                    const convertedTime = convertToSeconds($postedTime.trim());

                    convertedTimes.push(convertedTime);
                    if (index > 0) {
                        cy.wrap(convertedTimes[index]).should(
                            "be.gte",
                            convertedTimes[index - 1]
                        );
                    }
                });
            cy.get(".btn-close").click();
        });
    });

    it("Sorts by Oldest", () => {
        const convertedTimes = [];

        cy.get('.filter-list li.filter-item:contains("Oldest")').click();
        cy.wait(1000);
        cy.get(".gal .row .col .card").each(($card, index) => {
            // Click each card to open the popup
            cy.wrap($card).click();

            // Extract posted time from the popup
            cy.get(".posted-time")
                .invoke("text")
                .then(($postedTime) => {
                    const convertedTime = convertToSeconds($postedTime.trim());

                    convertedTimes.push(convertedTime);
                    if (index > 0) {
                        cy.wrap(convertedTimes[index]).should(
                            "be.lte",
                            convertedTimes[index - 1]
                        );
                    }
                });
            cy.get(".btn-close").click();
        });
    });
});
