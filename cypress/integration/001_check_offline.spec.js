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
describe('offline mode - Original tests of Cypress recipe', { browser: '!firefox' }, () => {
  // the application is making request to this url
  const url = 'https://jsonplaceholder.cypress.io/users'

  // make sure we get back online, even if a test fails
  // otherwise the Cypress can lose the browser connection
  beforeEach(() => Cypress.goOnline() )
  afterEach(() => Cypress.goOnline() )

  it('shows network status', () => {
    cy.visit('/001_check_offline/')
    cy.contains('#network-status', 'online').wait(1000) // for demo purpose

    Cypress.goOffline()
    cy.contains('#network-status', 'offline').wait(1000) // for demo purpose
  })

  it('shows error if we stub the network call', () => {
    Cypress.assertOnline()
    cy.visit('/001_check_offline/')
    cy.intercept(`${url}*`, { forceNetworkError: true }).as('users')
    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // cannot wait for the intercept that forces network error
    // https://github.com/cypress-io/cypress/issues/9062
    // cy.wait('@users', { timeout: 1000 }) // the network call happens
  })

  it('shows error trying to fetch users in offline mode', () => {
    cy.visit('/001_check_offline/')
    Cypress.assertOnline()

    // since this call returns a promise, must tell Cypress to wait
    // for it to be resolved
    Cypress.goOffline()
    Cypress.assertOffline()

    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // now let's go back online and fetch the users
    Cypress.goOnline()
    Cypress.assertOnline()
    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
  })

  it('makes fetch request when offline', () => {
    cy.visit('/001_check_offline/')

    Cypress.goOffline()
    Cypress.assertOffline()

    // let's spy on the "fetch" method the app calls
    cy.window().then((w) => cy.spy(w, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers'))

    cy.get('#load-users').click()
    cy.get('@fetchUsers').should('have.been.calledOnce')

    // now let's go back online and fetch the users
    Cypress.goOnline()
    Cypress.assertOnline()
    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
    cy.get('@fetchUsers').should('have.been.calledTwice')
  })

  it('does not reach the outside network when offline', () => {
      cy.visit('/001_check_offline/')

    // before we go offline we have to set up network intercepts
    // since they need to be communicated outside the browser
    // and lets keep track the number of network calls made
    let callCount = 0

    cy.intercept(`${url}*`, () => {
      callCount += 1
    }).as('users')

    Cypress.goOffline()
    Cypress.assertOffline()

    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // the cy.intercept network call does NOT happen
    // because the browser does not fire it
    // and thus our network proxy does not see it
    cy.then(() => {
      expect(callCount, 'no network calls made').to.equal(0)
    })

    // now let's go back online and fetch the users
    Cypress.goOnline()
    Cypress.assertOnline()

    cy.get('#load-users').click()
    // we can retry the assertion to know when the network call has happened
    // using .should callback function with an assertion inside
    .should(() => {
      expect(callCount, 'single network call').to.equal(1)
    })

    cy.wait('@users')
    .its('response.body')
    .should('have.length', 3)

    cy.get('.user').should('have.length', 3)
  })
})