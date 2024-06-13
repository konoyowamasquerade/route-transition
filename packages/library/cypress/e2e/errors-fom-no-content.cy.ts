beforeEach(() => {
  cy.visit('/no-content.html');
});

it('go to about page', () => {
  cy.findByText('About').click();
  cy.findByTestId('page-about').should('exist');
  cy.findByTestId('page-no-content').should('not.exist');
  cy.url().should('include', 'about');
});

it('stay on page if href is empty', () => {
  cy.findByText('Empty Href').click();
  cy.findByTestId('page-no-content').should('exist');
  cy.url().should('include', 'no-content');
});

it('stay on page if page not found', () => {
  cy.findByText('Not Exist').click();
  cy.findByTestId('page-no-content').should('exist');
  cy.url().should('include', 'no-content');
});

it('go to page without content', () => {
  cy.findByText('No Content').click();
  cy.findByTestId('page-no-content').should('exist');
  cy.url().should('include', 'no-content');
});
