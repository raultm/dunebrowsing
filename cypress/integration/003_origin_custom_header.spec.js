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
describe('origin custom header in response', { browser: '!firefox' }, () => {
  // the application is making request to this url
  const folder = '/003_origin_custom_header/index.html'
  
  before(() => {
    Cypress.removeSWs()
    cy.visit(folder)
    cy.get('#register').click()
    cy.contains('#sw-status', 'SW registered')
  })

  after( () => {
    cy.get('#unregister').click()
    cy.contains('#sw-status', 'SW not registered')  
  })



  it('can load cached page - sw origin', () => {
    cy.get('#fetch-url').clear().type('index.html').wait(250)
    cy.get('#fetch').click()
    cy.contains('#fetch-response', '200')
    cy.contains('#fetch-response', 'sw')
  })

  it('can not load non cached page - server origin', () => {
    cy.get('#fetch-url').clear().type('test.html').wait(250)
    cy.get('#fetch').click()
    cy.contains('#fetch-response', '200')
    cy.contains('#fetch-response', 'server')
  })
  
})
