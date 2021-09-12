// use window.navigator.onLine property to determine
// if the browser is offline or online
// https://caniuse.com/online-status
Cypress.assertOnline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.true')
}

Cypress.assertOffline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.false')
}
  

Cypress.goOffline = (fn) => {
    cy.log('**go offline**')
    .then(() => {
      Cypress.automation('remote:debugger:protocol',
        {
          command: 'Network.enable',
        })
    })
    .then(() => {
      Cypress.automation('remote:debugger:protocol',
        {
          command: 'Network.emulateNetworkConditions',
          params: {
            offline: true,
            latency: -1,
            downloadThroughput: -1,
            uploadThroughput: -1,
          },
        })
    })    
  }
  
Cypress.goOnline = (fn) => {
  cy.log('**go online**')
  .then(() => {
    // Remove all service workers
    Cypress.removeSWs()
    
    // https://chromedevtools.github.io/devtools-protocol/1-3/Network/#method-emulateNetworkConditions
    Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: false,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      }).then(() => {
        return Cypress.automation('remote:debugger:protocol',
          {
            command: 'Network.enable',
          })
      })
  })
}

  Cypress.removeSWs = () => {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
      registration.unregister()
    } })
  }