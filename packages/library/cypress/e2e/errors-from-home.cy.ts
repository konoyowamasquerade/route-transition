beforeEach(() => {
  cy.visit('/index.html');
});

it('stay on page if href is empty', () => {
  // const prevUrl = cy.url().
  cy.findByText('Empty Href').click();
  cy.findByTestId('page-home').should('exist');
  cy.url().should('include', 'index');
});

it('stay on page if page not found', () => {
  cy.findByText('Not Exist').click();
  cy.findByTestId('page-home').should('exist');
  cy.url().should('include', 'index');
});

it('go to page without content', () => {
  cy.findByText('No Content').click();
  cy.findByTestId('page-no-content').should('exist');
  cy.url().should('include', 'no-content');
});
