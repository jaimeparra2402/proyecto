describe('Pruebas E2E - Sistema de Jugadores', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/landing');
  });

  context('Módulo CRUD - Jugadores', () => {

    beforeEach(() => {
      cy.intercept('POST', '**/accounts:signInWithPassword**').as('firebaseLogin');
      cy.visit('/login');
      cy.get('ion-input').eq(0).find('input').type('jaime@gmail.com');
      cy.get('ion-input').eq(1).find('input').type('123456');
      cy.get('[data-testid="login-btn"]').click();
      cy.wait('@firebaseLogin');
    });

    it('[U] - Debería editar las propiedades de un jugador existente', () => {
      cy.intercept('PUT', '**/api/players/**', {
        statusCode: 200,
        body: { name: 'Jugador Editado' }
      }).as('updatePlayer');

      cy.visit('/player-list');
      cy.get('player-row-item').should('exist');

      cy.get('player-row-item').first().then(($el) => {
        $el[0].dispatchEvent(new CustomEvent('editClick', { bubbles: true, composed: true }));
      });

      cy.url().should('include', '/edit-player');
      cy.get('ion-input[label="Nombre Completo"]').should('be.visible');
      cy.get('ion-input[label="Nombre Completo"]').find('input').clear({ force: true }).type('Jugador Editado');

      cy.get('ion-button').contains('Guardar Cambios').click();
      cy.wait('@updatePlayer');

      cy.url().should('include', '/player-detail');
    });

    it('[D] - Debería eliminar un jugador de la lista', () => {
      cy.intercept('DELETE', '**/api/players/**', {
        statusCode: 200,
        body: {}
      }).as('deletePlayer');

      cy.intercept('GET', '**/api/players**', {
        statusCode: 200,
        body: Array(12).fill({ name: 'Jugador', team: 'Equipo', league: 'Liga', position: 'Attacker' })
      }).as('getPlayersAfterDelete');

      cy.visit('/player-list');
      cy.get('player-row-item').should('exist');

      cy.get('player-row-item').first().then(($el) => {
        $el[0].dispatchEvent(new CustomEvent('deleteClick', { bubbles: true, composed: true }));
      });

      cy.wait('@deletePlayer');
      cy.wait('@getPlayersAfterDelete');
      cy.get('player-row-item').should('have.length.lessThan', 13);
    });
  });

  context('Módulo CRUD - Comentarios y Valoraciones', () => {

    beforeEach(() => {
      cy.intercept('POST', '**/accounts:signInWithPassword**').as('firebaseLogin');
      cy.visit('/login');
      cy.get('ion-input').eq(0).find('input').type('admin@gmail.com');
      cy.get('ion-input').eq(1).find('input').type('123456');
      cy.get('[data-testid="login-btn"]').click();
      cy.wait('@firebaseLogin');
    });

    it('[C] - Debería publicar un nuevo comentario con valoración por estrellas', () => {
  cy.intercept('GET', '**/api/players/6a149fc72f31b5620c8a2652**', {
    statusCode: 200,
    body: {
      _id: '6a149fc72f31b5620c8a2652',
      name: 'Jugador Test',
      team: 'Equipo Test',
      league: 'Liga Test',
      position: 'Attacker',
      comments: [
        { _id: 'comment1', text: 'Increíble rendimiento esta temporada, ¡un crack!', rating: 4, author: '' }
      ]
    }
  }).as('getPlayer');

  cy.intercept('POST', '**/api/players/**/comments**', {
    statusCode: 201,
    body: { text: 'Increíble rendimiento esta temporada, ¡un crack!', rating: 4, author: '' }
  }).as('saveComment');

  cy.visit('/player-detail/6a149fc72f31b5620c8a2652');
  cy.wait('@getPlayer');

  cy.get('ion-textarea').find('textarea')
    .type('Increíble rendimiento esta temporada, ¡un crack!');

  cy.get('ion-select[label="Valoración (Estrellas)"]').click();
  cy.wait(500);
  cy.get('ion-popover').contains('4 Estrellas').click();

  cy.get('ion-button').contains('Publicar Opinión').click();
  cy.wait('@saveComment');

  cy.get('.comment-text').first()
    .should('contain.text', 'Increíble rendimiento esta temporada');
});


});

});