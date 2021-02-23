const { CYCLIC_KEY } = require("@storybook/addon-actions/dist/constants");

describe("Appointments",()=> {

  beforeEach(()=> {
    cy.request("get", "/api/debug/reset")
    cy.visit('/')
    cy.contains("Monday")
  });

  xit("should book an interview",() => {

    cy.get("[alt=Add]").first().click();
    cy.get("[data-testid=student-name-input]")
    .type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
    .contains("Sylvia Palmer");

  });

  xit("should edit an interview",() => {

    cy.get("[alt=Edit]").invoke("show").click();

    cy.get("[alt='Tori Malcolm']").click();

    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
    .contains("Tori Malcolm");
  });

  it("should cancel an interview",() => {

    cy.get("[alt=Delete]").invoke("show").click();
    cy.contains("Confirm").click()
    cy.contains("Deleting")
    cy.contains("Deleting").should('not.exist')

    cy.contains(".appointment__card--show", "Archie Cohen").should('not.exist')


  })


})