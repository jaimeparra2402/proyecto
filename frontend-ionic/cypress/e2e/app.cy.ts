describe('Pruebas E2E - Aplicación de Jugadores', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/landing');
  });

  it('Debería iniciar sesión correctamente con un usuario válido', () => {
    cy.intercept('POST', '**/accounts:signInWithPassword**').as('firebaseLogin');
    cy.visit('/login');
    cy.get('ion-input').eq(0).find('input').type('jaime@gmail.com');
    cy.get('ion-input').eq(1).find('input').type('123456');
    cy.get('[data-testid="login-btn"]').click();
    cy.wait('@firebaseLogin');
    cy.url().should('include', '/home');
  });

  it('Debería registrar un nuevo usuario con éxito', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.visit('/register');
  cy.wait(500);
  cy.get('ion-input').eq(0).find('input').type('nuevo@correo.com');
  cy.get('ion-input').eq(1).find('input').type('securePass123');
  cy.get('ion-button.main-btn').click();
  cy.url().should('not.include', '/register');
});

 it('Debería crear e insertar un nuevo jugador desde el formulario', () => {
  cy.intercept('POST', '**/accounts:signInWithPassword**').as('firebaseLogin');
  cy.visit('/login');
  cy.get('ion-input').eq(0).find('input').type('jaime@gmail.com');
  cy.get('ion-input').eq(1).find('input').type('123456');
  cy.get('[data-testid="login-btn"]').click();
  cy.wait('@firebaseLogin');

  cy.intercept('POST', '**/api/players**', {
    statusCode: 201,
    body: { name: 'Cristiano Ronaldo' }
  }).as('savePlayer');

  cy.visit('/add-player');
  cy.get('ion-input').eq(0).find('input').type('Cristiano Ronaldo');
  cy.get('ion-input').eq(1).find('input').type('Al-Nassr');

  cy.get('ion-select').eq(0).click();
cy.wait(800);
cy.get('ion-popover').contains('Premier League').click();

cy.get('ion-select').eq(1).click();
cy.wait(800);
cy.get('ion-popover').contains('Attacker').click();

cy.wait(500);

cy.get('ion-input[label="Partidos"]').find('input').type('900');
cy.get('ion-input[label="Goles"]').find('input').type('900');
cy.get('ion-input[label="Asistencias"]').find('input').type('250');
cy.get('ion-input[label="O introduce URL de Imagen externa"]').find('input')
  .type('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/220px-Cristiano_Ronaldo_2018.jpg');

cy.get('ion-button[color="success"]').click();
cy.wait('@savePlayer');
cy.url().should('include', '/player-list');
cy.get('player-row-item').should('exist');
});

it('Debería filtrar la lista al escribir en la barra de búsqueda', () => {
  cy.intercept('POST', '**/accounts:signInWithPassword**').as('firebaseLogin');
  cy.visit('/login');
  cy.get('ion-input').eq(0).find('input').type('jaime@gmail.com');
  cy.get('ion-input').eq(1).find('input').type('123456');
  cy.get('[data-testid="login-btn"]').click();
  cy.wait('@firebaseLogin');

  cy.intercept('GET', '**/api/players**', {
    statusCode: 200,
    body: [{ name: 'Cristiano Ronaldo', team: 'Al-Nassr', league: 'Premier League', position: 'Attacker' }]
  }).as('getPlayers');

  cy.visit('/player-list');
  cy.wait('@getPlayers');
  cy.get('player-row-item').should('exist');

  cy.intercept('GET', '**/api/players?name=Cristiano**', {
    statusCode: 200,
    body: [{ name: 'Cristiano Ronaldo', team: 'Al-Nassr', league: 'Premier League', position: 'Attacker' }]
  }).as('searchPlayer');

  cy.get('ion-input').eq(0).find('input').type('Cristiano');
  cy.get('ion-button').contains('Buscar Jugador').click();
  cy.wait('@searchPlayer');

  cy.get('player-row-item')
  .should('have.length', 1);
cy.get('player-row-item').first()
  .shadow()
  .find('h2')
  .should('contain.text', 'Cristiano Ronaldo');
});
});