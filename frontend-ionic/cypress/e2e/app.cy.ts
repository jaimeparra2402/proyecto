describe('Pruebas E2E - Aplicación de Jugadores', () => {
  
  beforeEach(() => {
    // Cambia la URL por la de tu entorno local
    cy.visit('http://localhost:8100/landing'); 
  });

  // 1. PRUEBA: Inicio de sesión
  it('Debería iniciar sesión correctamente con un usuario válido', () => {
    cy.visit('/login');
    cy.get('ion-input[type="email"]').type('test@usuario.com');
    cy.get('ion-input[type="password"]').type('password123');
    cy.get('ion-button.login-btn').click();
    
    // Verifica que tras loguear nos redirija a la lista de jugadores
    cy.url().should('include', '/player-list');
    cy.get('app-header').should('contain', 'test@usuario.com');
  });

  // 2. PRUEBA: Registro de usuario
  it('Debería registrar un nuevo usuario con éxito', () => {
    cy.visit('/register');
    cy.get('ion-input[name="username"]').type('NuevoJugador');
    cy.get('ion-input[type="email"]').type('nuevo@correo.com');
    cy.get('ion-input[type="password"]').type('securePass123');
    cy.get('ion-button.register-submit').click();

    // Debería mandarnos al login o dentro de la app
    cy.url().should('not.include', '/register');
  });

  // 3. PRUEBA: Inserción de un nuevo elemento a partir del formulario
  it('Debería crear e insertar un nuevo jugador desde el formulario', () => {
    // Simulamos que ya estamos logueados como admin
    cy.visit('/add-player'); 
    cy.get('ion-input[name="name"]').type('Cristiano Ronaldo');
    cy.get('ion-input[name="team"]').type('Al-Nassr');
    cy.get('ion-input[name="league"]').type('Saudi Pro League');
    cy.get('ion-select[name="position"]').click();
    cy.get('ion-select-option').contains('Attacker').click();
    
    cy.get('ion-button[type="submit"]').click();

    // Verifica que volvió a la lista y el nuevo elemento de Stencil está renderizado
    cy.url().should('include', '/player-list');
    cy.get('player-row-item').should('attr', 'name', 'Cristiano Ronaldo');
  });

  // 4. PRUEBA: Búsqueda de elementos
  it('Debería filtrar la lista al escribir en la barra de búsqueda', () => {
    cy.visit('/player-list');
    // Buscamos un jugador que sepamos que existe
    cy.get('ion-searchbar').type('Cristiano');
    
    // Aseguramos que los elementos que no coincidan desaparezcan
    cy.get('player-row-item').each(($el) => {
      cy.wrap($el).should('have.attr', 'name').and('include', 'Cristiano');
    });
  });

});