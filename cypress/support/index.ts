/// <reference types="cypress" />
// ***********************************************************
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import "./commands"

// https://docs.cypress.io/guides/tooling/typescript-support#Types-for-custom-commands
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to do various checks related to our pages layout.
             * @example cy.checkLayoutElements()
             */
            checkLayoutElements(): Chainable<Element>
        }
    }
}

export {} // only to make TypeScript happy, because of the `isolatedModules` config
