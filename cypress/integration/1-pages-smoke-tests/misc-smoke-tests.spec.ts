/// <reference types="cypress" />
// Welcome to Cypress!
//
// Getting started guide:
// https://on.cypress.io/introduction-to-cypress
import { PROJECTS_WITH_GALLERY, PROJECT_IDS } from "../../../src/constants"
import { PROJECT_NAMES } from "../../../src/i18n"

interface PageCharacteristics {
    path: string
    h1: string
}
const MARKDOWN_BASED_PAGES: PageCharacteristics[] = [
    { path: "contact-us", h1: "Contact Us" },
    { path: "gallery-instructions", h1: "Adding to the Gallery" },
    { path: "jobs", h1: "Jobs for Textualize" },
    { path: "privacy", h1: "Privacy" },
    { path: "terms", h1: "Terms and Conditions" },
    { path: "what-we-do", h1: "What we do" },
]

describe("website smoke tests", () => {
    it("displays the homepage", () => {
        cy.visit("/")

        cy.checkLayoutElements()
        cy.contains("We love terminals")

        for (const projectId of PROJECT_IDS) {
            cy.get(`#project-${projectId}`).as("projectBlock")
            cy.get("@projectBlock").contains("Code")
            cy.get("@projectBlock").contains("Code")
            if (PROJECTS_WITH_GALLERY.includes(projectId)) {
                cy.get("@projectBlock").contains("Gallery")
            } else {
                cy.get("@projectBlock").contains("Gallery").should("not.exist")
            }
        }
    })

    it("displays various Markdown-based pages", () => {
        for (const page of MARKDOWN_BASED_PAGES) {
            cy.visit(`/${page.path}`)

            cy.checkLayoutElements()

            cy.get("h1").should("have.text", page.h1)
        }
    })

    it("displays galleries", () => {
        for (const projectId of PROJECTS_WITH_GALLERY) {
            cy.visit(`/${projectId}/gallery`)

            cy.checkLayoutElements()

            cy.contains(`Projects using ${PROJECT_NAMES[projectId]}`)
            cy.contains("Submit a project to the gallery").should("match", "[href='/gallery-instructions']")
            cy.get(".categories-wrapper .categories-wrapper__category.link").should("have.length.at.least", 3)
            cy.get(".gallery-item").should("have.length.at.least", 2)
        }
    })
})

export {} // only to make TypeScript happy, because of the `isolatedModules` config
