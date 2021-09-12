// offlinemode.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test


/// <reference types="cypress" />



// since we are using Chrome debugger protocol API
// we should only run these tests when NOT in Firefox browser
// see https://on.cypress.io/configuration#Test-Configuration
describe('basic service worker', { browser: '!firefox' }, () => {
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
  
  describe('register service worker - hijack fetch events(online/offline) and serves only cached pages', () => {

    beforeEach(() => {
      cy.visit(folder)
      cy.get('#register').click()
      // Need to wait for status confirmation
      cy.contains('#sw-status', 'SW registered')
    })
    //afterEach(() =>  )

    it('sw status reflects registration', () => {
      cy.contains('#sw-status', 'SW registered')
    })

    describe('offline mode', () => {
      beforeEach(() => {
        Cypress.goOffline()
        Cypress.assertOffline()
      })

      it('can load cached page', () => {
        cy.get('#fetch-url').clear().type('index.html')
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '200')
      })

      it('can not load non cached page', () => {
        cy.get('#fetch-url').clear().type('test.html').wait(250)
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '404')
      })

      it('can not load non existent', () => {
        cy.get('#fetch-url').clear().type('non-existent.php').wait(250)
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '404')
      })
    })

    describe('online mode', () => {
      beforeEach(() => {
        Cypress.goOnline()
        Cypress.assertOnline()
      })

      it('can load cached page', () => {
        cy.get('#fetch-url').clear().type('index.html')
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '200')
      })

      it('can not load non cached page', () => {
        cy.get('#fetch-url').clear().type('test.html').wait(500)
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '404')
      })

      it('can not load non existent', () => {
        cy.get('#fetch-url').clear().type('non-existent.php').wait(250)
        cy.get('#fetch').click()
        cy.contains('#fetch-response', '404')
      })
    })
  })
})
