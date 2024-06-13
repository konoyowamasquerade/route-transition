beforeEach(() => {
  cy.visit('/index.html');
});

it('go to about page', () => {
  cy.findByText('About').click();
  cy.findByTestId('page-about').should('exist');
  cy.findByTestId('page-home').should('not.exist');
  cy.url().should('include', 'about');
});

it('go to about page and go back by navigator', () => {
  cy.findByText('About').click();
  cy.findByTestId('page-about').should('exist');
  cy.findByTestId('page-home').should('not.exist');
  cy.url().should('include', 'about');

  cy.wait(500);
  cy.go('back');

  cy.findByTestId('page-home').should('exist');
  cy.findByTestId('page-about').should('not.exist');
  cy.url().should('include', 'index');
});
