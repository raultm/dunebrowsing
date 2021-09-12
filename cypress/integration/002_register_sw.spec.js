// offlinemode.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


/// <reference types="cypress" />



console.log(Cypress.goOnline)
  // since we are using Chrome debugger protocol API
  // we should only run these tests when NOT in Firefox browser
  // see https://on.cypress.io/configuration#Test-Configuration
  describe('register service workers', { browser: '!firefox' }, () => {
    // the application is making request to this url
    const folder = '/002_register_sw/index.html'
  
    // make sure we get back online, even if a test fails
    // otherwise the Cypress can lose the browser connection
    beforeEach(() => Cypress.goOnline() )
    afterEach(() => Cypress.goOnline() )
  
    it('shows sw status', () => {
      cy.visit(folder)
      cy.contains('#sw-status', 'SW not registered')
    })
  
    it('register sw updates status', () => {
      cy.visit(folder)
      cy.get('#register').click()
      cy.contains('#sw-status', 'SW registered')
    })
  
    it('can load if sw registered, offline mode and try to visit', () => {
      cy.visit(folder)
      cy.contains('#sw-status', 'SW not registered')
      cy.get('#register').click().wait(1000)
      
      Cypress.goOffline()
      Cypress.assertOffline()
      
      cy.get('#fetch-url').clear().type('index.html')
      cy.get('#fetch').click()
      cy.contains('#fetch-response', '200')
      
      
      Cypress.goOnline()
      Cypress.assertOnline()
    })

    it('show 404 if sw registered, offline mode and try to visit non existing page', () => {
      cy.visit(folder)
      cy.contains('#sw-status', 'SW not registered')
      cy.get('#register').click().wait(1000)
      
      Cypress.goOffline()
      Cypress.assertOffline()

      cy.get('#fetch-url').clear().type('non-existent.php')
      cy.get('#fetch').click()
      cy.contains('#fetch-response', '404')
    })
  })