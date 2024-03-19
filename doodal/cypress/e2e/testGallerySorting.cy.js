describe("Gallery Sorting", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");

        cy.url().should("eq", "http://localhost:3000/");
        cy.wait(2000)
          cy.get(".swiper-wrapper .swiper-slide-active") // Target the first  tile
            .within(() => {
              cy.get(".card-img-flush").click(); // Click the image within the first tile
            });
    });

    it("Sorts by Least Liked", () => {
        cy.get('.filter-list li.filter-item:contains("Least Liked")').click();
        //delay needed while values sorted
        cy.wait(1000);
        // Get all like counters in the order displayed
        cy.get(".gal .row .col .card .like-container .like-counter").then(
            ($likeCounters) => {
                cy.log("$likeCounters");
                cy.log("test");

                for (let i = 1; i < $likeCounters.length; i++) {
                    const previousCount = parseInt(
                        $likeCounters.eq(i - 1).text()
                    );
                    const currentCount = parseInt($likeCounters.eq(i).text());
                    cy.wrap(currentCount).should("be.gte", previousCount);
                }
            }
        );
    });

    it("Sorts by Most Liked", () => {
        cy.get('.filter-list li.filter-item:contains("Most Liked")').click();
        //delay needed while values sorted
        cy.wait(1000);
        // Get all like counters in the order displayed
        cy.get(".gal .row .col .card .like-container .like-counter").then(
            ($likeCounters) => {
                for (let i = 1; i < $likeCounters.length; i++) {
                    const previousCount = parseInt(
                        $likeCounters.eq(i - 1).text()
                    );
                    const currentCount = parseInt($likeCounters.eq(i).text());
                    cy.wrap(currentCount).should("be.lte", previousCount);
                }
            }
        );
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
