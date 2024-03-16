const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    username1: 'cypress-testing-1',
    password1: 'Cypress-password-1',
    username2: 'cypress-testing-2',
    password2: 'Cypress-password-2'
  }
});
