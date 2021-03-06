# Dune Browsing

## Target
The aim of this repository is the exploration of testability of [services workers](https://en.wikipedia.org/wiki/Progressive_web_application#Service_workers) in offline mode. 

## Approaches 
The first approach is using [cypress](https://www.cypress.io/) although offline mode is only supported in Chrome.

## Commands

Run tests without UI. Boot up localhost server and run tests

``` npm test ```

Run tests with UI. Boot up localhost server and launch Cypress UI

``` npm run test:ui```

## Want to add another Evolution Step
1. Create a doc in docs/XXX.md
2. Add to README
3. Test the behaviour
4. Write the code
5. Push or PR

## Evolution

- [003](docs/003.md)\. Add custom header to identify response from SW or from Server
- [002](docs/002.md)\. Register a Service Worker and test *fetch* funcionality in offline mode
- [001](docs/001.md)\. Original tests of Cypress Offline Recipe

## Problems encountered

- Cypress and offline mode only works smoothly when using localhost, at the beginning i was using [Valet for Linux](https://cpriego.github.io/valet-linux/) and i was having a huge amount of setbacks until [i reach this comment in a cypress issue](https://github.com/cypress-io/cypress/issues/17723#issuecomment-906152925)

- Right now Chrome is the only way to set offline mode thanks to the [CDP (Chrome DevTools Protocol)](https://chromedevtools.github.io/devtools-protocol/) which allows the test runner to modify certains aspects of the using browser.
